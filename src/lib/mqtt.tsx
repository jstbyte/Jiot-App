import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { connect, MqttClient, OnMessageCallback } from 'mqtt/dist/mqtt.min';
import { useSettings } from '@/screens/settings';

type MqttContextType = {
  client: MqttClient | null;
  connected: boolean;
  connect: (url: string) => Function;
};

const MqttContext = createContext<MqttContextType>({
  client: null,
  connected: false,
  connect: () => () => null,
});

export const useMqtt = () => useContext(MqttContext);

type ProviderProps = { children: ReactNode };
export const MqttProvider = ({ children }: ProviderProps) => {
  const ref = useRef<MqttClient | null>(null);
  const [connected, setConnected] = useState(false);

  const _connect = (url: string) => {
    if (ref.current !== null) {
      ref.current.reconnect();
    } else {
      ref.current = connect(url);
      ref.current.on('connect', () => {
        setConnected(true);
      });

      ref.current.on('disconnect', () => {
        setConnected(false);
      });
    }

    return () => {
      if (ref.current) ref.current?.end();
      setConnected(false);
    };
  };

  return (
    <MqttContext.Provider
      value={{
        connected,
        client: ref.current as MqttClient,
        connect: _connect,
      }}>
      {children}
    </MqttContext.Provider>
  );
};

export const useMqttHelper = (topic: string, callback: OnMessageCallback) => {
  const mqtt = useMqtt();
  useEffect(() => {
    if (!mqtt.connected) return;
    mqtt.client?.subscribe(topic);
    mqtt.client?.addListener('message', callback);
    return () => {
      mqtt.client?.unsubscribe(topic);
      mqtt.client?.removeListener('message', callback);
    };
  }, [mqtt, topic]);
  return mqtt;
};
