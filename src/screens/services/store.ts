import { useSubscription } from '@/lib/mqtt';
import { useEffect, useState } from 'react';
import { useSettings, Device, SonoffService } from '../settings';

export const useStore = () => {
  const [settings] = useSettings();
  const [devs, setDevs] = useState<Device[]>([]);

  const mqtt = useSubscription(
    [`${settings.mqttPrefix}/+/res/#`],
    (topic, payload) => {
      const regEx = /^[\s\S]*\/([a-zA-Z0-9._]{3,10})\/res\/[\s\S]*$/;
      const match = topic.match(regEx);

      if (match?.length == 2) {
        setDevs((devs) =>
          devs.map((dev: Device) => {
            if (dev.name == match[1]) {
              if (topic.includes('sonoff')) {
                const sonoffMod = [...(dev.services.sonoff as SonoffService[])];
                const data = payload.toString().split(';');
                data.forEach((el: any) => {
                  const csd = el.match(/^([0-9]{1,3}):([0-9]{1,3})$/);
                  if (csd) {
                    sonoffMod[parseInt(csd[1])].synced = true;
                    sonoffMod[parseInt(csd[1])].state =
                      csd[2] == '0' ? true : false; // Inverted logic for relay;
                  }
                });

                return {
                  ...dev,
                  synced: true,
                  services: {
                    ...dev.services,
                    sonoff: sonoffMod,
                  },
                };
              }

              // If include('anything');
            }
            return dev;
          })
        );
      }
    }
  );

  const syncData = () => {
    if (mqtt.status != 'connected') return;
    settings.devices.forEach((dev) => {
      mqtt.client?.publish(
        `${settings.mqttPrefix}/${dev.name}/req/devinfo`,
        'sync'
      );
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
        `${settings.mqttPrefix}/${devs[devIndex].name}/req/sonoff`,
        `${digIndex}:3`
      );
    }
  };

  useEffect(() => syncData(), [mqtt.status]);
  useEffect(() => {
    if (settings.ready) {
      if (mqtt.status != 'connected') mqtt.connect(`wss://${settings.mqttUrl}`);
      setDevs(settings.devices);
      syncData();
    }
  }, [settings.ready]);

  return { mqtt, devs, setPin };
};

export type Store = ReturnType<typeof useStore>;
