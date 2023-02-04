import { useSubscription } from '@/lib/mqtt';
import { useEffect } from 'react';
import { useSettings } from '../settings';
import { useMqttConfig } from '@/lib/hooks';

/* Test Component */
export default function Update() {
  const [config, setConfig] = useMqttConfig('mqtt-config');
  const { mqtt, message } = useSubscription([`${config.secrat}/+/res/sonoff`]);

  useEffect(() => mqtt.connect(`wss://${config.url}`), []);

  return <div>Update Firmware {mqtt.status}</div>;
}
