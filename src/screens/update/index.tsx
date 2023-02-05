import { useEffect } from 'react';
import { useSubscription, useTopic } from '@/lib/mqtt';
import { useMqttConfig } from '@/lib/hooks';
import { Link } from '@/components/NavLink';
import { Button } from '@mantine/core';

/* Test Component */
export default function Update() {
  const [config] = useMqttConfig('mqtt-config');
  const home = useTopic(`${config.secrat}/MyHome/res/sonoff`);
  const room = useTopic(`${config.secrat}/MyRoom/res/sonoff`);
  const mqtt = useSubscription([`${config.secrat}/+/res/sonoff`]);

  useEffect(() => mqtt.connect(`wss://${config.url}`), []);

  return (
    <div>
      Update Firmware {mqtt.status}
      <div>Messages: {home}</div>
      <div>Messages: {room}</div>
      <Link href='/settings'>
        <Button>Setup App</Button>
      </Link>
    </div>
  );
}
