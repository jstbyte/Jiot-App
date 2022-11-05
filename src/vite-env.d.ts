/// <reference types="vite/client" />

// interface ImportMetaEnv {
//   readonly VITE_HOST: string;
// }

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'mqtt/dist/mqtt.min' {
  import MQTT from 'mqtt';
  export = MQTT;
}
