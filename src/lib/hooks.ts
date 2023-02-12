import { useState, useEffect } from 'react';

type Value<T> = [T, (value: T) => void]; // Initial Value Type;
export function useLocalStorage<T>(key: string, def: T): Value<T> {
  const [value, setValue] = useState<T>(() => {
    const item = window.localStorage.getItem(key);
    try {
      return item ? JSON.parse(item as string) : def;
    } catch (error) {
      console.debug(error);
      return item;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value || ''));
  }, [value, key]);

  return [value, setValue];
}

/*************************************************************************/
export type MqttConfig = { url: string; secrat: string };
export const useMqttConfig = (key: string) => {
  return useLocalStorage<MqttConfig>(key, {
    url: 'broker.emqx.io:8084/mqtt',
    secrat: '',
  });
};
