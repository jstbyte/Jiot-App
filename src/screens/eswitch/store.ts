import { useRouter } from '@/components/Router';
import { useMqttHelper } from '@/lib/mqtt';
import { useEffect, useState } from 'react';
import { useSettings, Device, DigiOut } from '../settings';

export const useStore = () => {
  const [settings] = useSettings();
  const [devs, setDevs] = useState<Device[]>([]);

  const mqtt = useMqttHelper(
    `${settings.mqttPrefix}/res/digiout/+`,
    (topic, payload) => {
      const regEx = /^[\s\S]*\/res\/digiout\/([0-9]*)$/;
      const match = topic.match(regEx);

      if (match?.length == 2) {
        const data = JSON.parse(payload.toString()) as any;
        setDevs((devs) =>
          devs.map((dev) => {
            if (dev.id == match[1] && dev.digiouts.length == data.length) {
              const pins = dev.digiouts.map((pin, i) => {
                // if (pin.synced) return pin;
                return {
                  ...pin,
                  synced: true,
                  state: !data[i],
                };
              });
              return { ...dev, synced: true, digiouts: pins };
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
      mqtt.client?.publish(`${settings.mqttPrefix}/req/digiout/${dev.id}`, '0');
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
        newState[devIndex].digiouts[digIndex].synced = false;
        newState[devIndex].digiouts[digIndex].state = !curState;
        return newState;
      });

      mqtt.client.publish(
        `${settings.mqttPrefix}/req/digiout/${devs[devIndex].id}`,
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
