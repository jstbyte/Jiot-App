import { matches } from 'mqtt-pattern';
import { connect as mqttConnect } from 'mqtt/dist/mqtt.min';
import { createContext, useCallback, useContext } from 'react';
import { useEffect, useRef, useState, ReactNode } from 'react';
import type { IClientSubscribeOptions } from 'mqtt/dist/mqtt.min';
import type { MqttClient, OnMessageCallback } from 'mqtt/dist/mqtt.min';

/* Types Declarations */
type ICSO = IClientSubscribeOptions;
type ConFunc = (url: string) => any;
type Msg = { topic: string; data: string };
type ProviderProps = { children: ReactNode };
type ConnStatus = 'offline' | 'connected' | 'disconnected';
type MqttCtx = { status: ConnStatus; client?: MqttClient; connect: ConFunc };

const MqttContext = createContext<MqttCtx>({} as MqttCtx);
export const useMqtt = () => useContext(MqttContext);

export const MqttProvider = ({ children }: ProviderProps) => {
  const [status, setStatus] = useState<ConnStatus>('offline');
  const mqttRef = useRef<MqttClient>();
  const urlRef = useRef('');

  const connect = (url: string) => {
    if (url.length < 10) return; // Invalid URL;
    if (url == urlRef.current) return; // Skips;

    urlRef.current = url;
    mqttRef.current = mqttConnect(url);
    mqttRef.current.on('connect', () => setStatus('connected'));
    mqttRef.current.on('disconnect', () => setStatus('disconnected'));
    mqttRef.current.on('offline', () => setStatus('offline'));
    mqttRef.current.on('error', (err) => setStatus(err.message as 'offline'));
    mqttRef.current.on('end', () => setStatus('offline'));

    return () => mqttRef.current?.end();
  };

  return (
    <MqttContext.Provider
      value={{
        status,
        connect,
        client: mqttRef.current,
      }}>
      {children}
    </MqttContext.Provider>
  );
};

export const useSubscription = (topic: string[], options = {} as ICSO) => {
  const [message, setMessage] = useState<Msg>({ topic: '', data: '' });
  const mqtt = useMqtt();

  const subscribe = useCallback(() => {
    mqtt.client?.subscribe(topic, options);
  }, [mqtt.client, topic, options]);

  const callback = useCallback(
    (_topic: string, _data: any) => {
      if ([topic].flat().some((rTopic) => matches(rTopic, _topic))) {
        setMessage({
          topic: _topic,
          data: _data.toString(),
        });
      }
    },
    [topic]
  );

  useEffect(() => {
    if (!mqtt.client?.connected) return;
    subscribe(); // Subscribe The Topic;
    mqtt.client.addListener('message', callback);
    return () => {
      mqtt.client?.removeListener('message', callback);
      // Maybe Unsubscribe;
    };
  }, [mqtt.client, subscribe, callback]);

  return { mqtt, message };
};

/** @deprecated use useSubscription instead */
export const useMqttHelper = (topic: string, callback: OnMessageCallback) => {
  const mqtt = useMqtt();
  useEffect(() => {
    if (mqtt?.status != 'connected') return;
    mqtt.client?.subscribe(topic);
    mqtt.client?.addListener('message', callback);
    return () => {
      mqtt.client?.unsubscribe(topic);
      mqtt.client?.removeListener('message', callback);
    };
  }, [mqtt, topic]);
  return mqtt;
};
