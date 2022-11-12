import { useRouter } from '@/components/Router';
import { useMqttHelper } from '@/lib/mqtt';
import { useEffect, useState } from 'react';
import { useSettings, Device, Services, Sonoff } from '../settings';

export const useStore = () => {
  const [settings] = useSettings();
  const [devs, setDevs] = useState<Device[]>([]);

  const mqtt = useMqttHelper(
    `${settings.mqttPrefix}/res/sonoff/+`,
    (topic, payload) => {
      const regEx = /^[\s\S]*\/res\/sonoff\/([0-9]*)$/;
      const match = topic.match(regEx);

      if (match?.length == 2) {
        /* MQTT Message From sonoff Service */
        const data = JSON.parse(payload.toString()) as any;
        setDevs((devs) =>
          devs.map((dev) => {
            if (dev.uid == match[1]) {
              const pins = (dev.services as Services).sonoff?.map((pin, i) => {
                // if (pin.synced) return pin;
                return {
                  ...pin,
                  synced: true,
                  state: !data[i],
                };
              });
              return {
                ...dev,
                synced: true,
                services: { ...dev.services, sonoff: pins },
              };
            }
            return dev;
          })
        );
      }
    }
  );

  const syncData = () => {
    if (!mqtt.connected) return;
    settings.devices.forEach((dev) => {
      mqtt.client?.publish(`${settings.mqttPrefix}/req/sonoff/${dev.uid}`, '0');
    });
  };

  const setPin = async (
    devIndex: number,
    digIndex: number,
    curState: boolean
  ) => {
    if (mqtt.client?.connected) {
      setDevs((state) => {
        const newState = [...state];
        newState[devIndex].synced = false;
        // @ts-ignore
        newState[devIndex].services.sonoff[digIndex].synced = false;
        // @ts-ignore
        newState[devIndex].services.sonoff[digIndex].state = !curState;
        return newState;
      });

      mqtt.client.publish(
        `${settings.mqttPrefix}/req/sonoff/${devs[devIndex].uid}`,
        `${digIndex}:2`
      );
    }
  };

  useEffect(() => syncData(), [mqtt.connected]);
  useEffect(() => {
    if (settings.ready) {
      if (!mqtt.connected) mqtt.connect(`wss://${settings.mqttUrl}`);
      setDevs(settings.devices);
      syncData();
    }
  }, [settings.ready]);

  return { mqtt, devs, setPin };
};

export type Store = ReturnType<typeof useStore>;
