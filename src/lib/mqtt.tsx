import { SetStateAction } from 'react';
import { MqttClient } from 'mqtt/dist/mqtt.min';
import { createContext, Dispatch, useContext } from 'react';
import { connect as mqttConnect } from 'mqtt/dist/mqtt.min';
import { useEffect, useRef, useState, ReactNode } from 'react';

/* Types Declarations */
type ConFunc = (url: string) => any;
type Subscribers = Map<string, OnMessageEvent>;
type MqttProviderProps = { children: ReactNode };
type OnMessageEvent = (topic: string, payload: Buffer) => any;
export const res2req = (t: string) => t.replace('/res/', '/req/');
type Mctx = { status: ConnStatus; client?: MqttClient; connect: ConFunc };
type MqttCtx = Mctx & { subscribers: Subscribers }; // Use This Type only;
type ConnStatus = 'offline' | 'connected' | 'disconnected' | 'reconnecting';

const MqttContext = createContext<MqttCtx>({} as MqttCtx);

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
      }}
    >
      {children}
    </MqttContext.Provider>
  );
}

export function useMqtt(topics: string[] = []) {
  const mqtt = useContext(MqttContext);
  useEffect(() => {
    if (!topics.length) return; // Guard Clause
    const client = mqtt.client?.subscribe(topics);
    return () => client?.unsubscribe(topics) as any;
  }, [mqtt.client, ...topics]); // Dependency Watching;
  return mqtt;
}

type iUT = [string, Dispatch<SetStateAction<string>>, MqttCtx];
export function useTopic(topic: string, sub = false): iUT {
  const mqtt = useMqtt(sub ? [topic] : []);
  const [msg, setMsg] = useState('');

  useEffect((): any => {
    const cb = (_: any, p: Buffer) => setMsg(p.toString());
    mqtt.subscribers.set(topic, cb); // Subscribes;
    return () => mqtt.subscribers.delete(topic);
  }, [topic]);

  return [msg, setMsg, mqtt];
}
