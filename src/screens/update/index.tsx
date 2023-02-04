import { useSubscription } from '@/lib/mqtt';
import { useEffect } from 'react';
import { useSettings } from '../settings';

/* Test Component */
export default function Update() {
  const [settings] = useSettings();
  const { mqtt, message } = useSubscription([
    `${settings.mqttPrefix}/+/res/sonoff`,
  ]);

  console.log(message);

  useEffect(() => {
    if (!settings.ready) return;
    mqtt.connect(`wss://${settings.mqttUrl}`);
  }, [settings]);

  return <div>Update Firmware {mqtt.status}</div>;
}
