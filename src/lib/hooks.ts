import { useState, useEffect, useRef } from 'react';

export function getLS<T = string>(key: string, def: T): T {
  const item = window.localStorage.getItem(key);
  try {
    return item ? JSON.parse(item as string) : def;
  } catch (error) {
    console.debug(error);
    return item as T;
  }
}

// Use Local Storage Hook;
type Value<T> = [T, (value: T) => void]; // Initial Value Type;
export function useLocalStorage<T>(key: string, def: T): Value<T> {
  const [value, setValue] = useState<T>(() => getLS(key, def));

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value || ''));
  }, [value, key]);

  return [value, setValue];
}

// Long Press Detaction Hook
export function useLongPress(callback = () => {}, ms = 300) {
  const [startLongPress, setStartLongPress] = useState(false);
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    const handleTouchStart = () => {
      timeoutRef.current = setTimeout(() => {
        callback();
        setStartLongPress(false);
      }, ms);
      setStartLongPress(true);
    };

    const handleTouchEnd = () => {
      clearTimeout(timeoutRef.current);
      setStartLongPress(false);
    };

    const node = document.documentElement;

    node.addEventListener('touchstart', handleTouchStart);
    node.addEventListener('touchend', handleTouchEnd);

    return () => {
      node.removeEventListener('touchstart', handleTouchStart);
      node.removeEventListener('touchend', handleTouchEnd);
    };
  }, [callback, ms]);

  return startLongPress;
}

// LocalStorage Mqtt Config Hook;
export type MqttConfig = { url: string; secrat: string };
export const useMqttConfig = (key: string) => {
  return useLocalStorage<MqttConfig>(key, {
    url: 'broker.emqx.io:8084/mqtt',
    secrat: '',
  });
};
