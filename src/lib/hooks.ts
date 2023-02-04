import { useState, useEffect } from 'react';

type Value<T> = [T, (value: T) => void]; // Initial Value Type;
export function useLocalStorage<T>(key: string, def: T): Value<T> {
  const [value, setValue] = useState<T>(() => {
    const item = window.localStorage.getItem(key);
    return item !== null ? JSON.parse(item) : def;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}
