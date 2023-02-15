import { createContext, useCallback, useContext } from 'react';
import { useEffect, useRef, useState, ReactNode } from 'react';
import { OnMessageCallback, connect as mqttConnect } from 'mqtt/dist/mqtt.min';
import type { MqttClient } from 'mqtt/dist/mqtt.min';
import { matches } from 'mqtt-pattern';

/* Types Declarations */
type ConFunc = (url: string) => any;
type Subscribers = Map<string, OnMessageEvent>;
type MqttProviderProps = { children: ReactNode };
const payloadParser = (payload: Buffer) => payload.toString();
type OnMessageEvent = (topic: string, payload: Buffer) => any;
type Mctx = { status: ConnStatus; client?: MqttClient; connect: ConFunc };
type MqttCtx = Mctx & { subscribers: Subscribers }; // Use This Type only;
type ConnStatus = 'offline' | 'connected' | 'disconnected' | 'reconnecting';

const MqttContext = createContext<MqttCtx>({} as MqttCtx);
export const useMqtt = () => useContext(MqttContext);

export function MqttProvider({ children }: MqttProviderProps) {
  const [status, setStatus] = useState<ConnStatus>('offline');
  const _mapRef = useRef<Subscribers>(new Map());
  const mqttRef = useRef<MqttClient>();
  const urlRef = useRef('');

  const connect = (url: string) => {
    if (url == urlRef.current) return;
    mqttRef.current = mqttConnect(url);
    mqttRef.current.on('offline', () => setStatus('offline'));
    mqttRef.current.on('connect', () => setStatus('connected'));
    mqttRef.current.on('disconnect', () => setStatus('disconnected'));
    mqttRef.current.on('reconnect', () => setStatus('reconnecting'));
    mqttRef.current.on('error', (err) => setStatus(err.message as 'offline'));
    mqttRef.current.on('end', () => setStatus('offline'));
    mqttRef.current.on('message', (topic, payload) => {
      _mapRef.current.get(topic)?.(topic, payload);
    });
  };

  useEffect(() => () => mqttRef.current?.end() as any, []);

  return (
    <MqttContext.Provider
      value={{
        status,
        connect,
        client: mqttRef.current,
        subscribers: _mapRef.current,
      }}>
      {children}
    </MqttContext.Provider>
  );
}

export function useTopic(topic: string, parser = payloadParser) {
  const [msg, setMsg] = useState<ReturnType<typeof parser>>('');
  const { subscribers } = useMqtt(); // Get Mqtt Subscribers;
  const callback = useCallback<OnMessageEvent>(
    (_, payload) => setMsg(parser(payload)),
    [topic, parser]
  );

  useEffect(() => {
    setMsg('');
    subscribers.set(topic, callback);
    return () => subscribers.delete(topic) as any;
  }, [callback]);

  return msg;
}

export function useSubscription(topic: string[], callback?: OnMessageEvent) {
  const mqtt = useMqtt(); // Get Global Mqtt Handle From MqttProvider Context;

  const callbackMemo = useCallback(
    (_topic: string, _payload: any) => {
      if ([topic].flat().some((rTopic) => matches(rTopic, _topic))) {
        callback?.(_topic, _payload);
      }
    },
    [topic]
  );

  useEffect(() => {
    if (mqtt.status != 'connected') return;
    mqtt.client?.subscribe(topic);
    if (!callback) return () => mqtt.client?.unsubscribe(topic);

    mqtt.client?.addListener('message', callbackMemo);
    return () => {
      mqtt.client?.unsubscribe(topic);
      mqtt.client?.removeListener('message', callbackMemo);
    };
  }, [mqtt.client, mqtt.status, callbackMemo]);
  return mqtt;
}
