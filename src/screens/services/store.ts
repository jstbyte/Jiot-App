import { useRouter } from '@/components/Router';
import { useMqttHelper } from '@/lib/mqtt';
import { useEffect, useState } from 'react';
import {
  useSettings,
  Device,
  Services,
  SonoffService,
  DoorService,
} from '../settings';

export const useStore = () => {
  const [settings] = useSettings();
  const [devs, setDevs] = useState<Device[]>([]);

  const mqtt = useMqttHelper(
    `${settings.mqttPrefix}/res/#`,
    (topic, payload) => {
      const regEx = /^[\s\S]*\/res\/[a-zA-Z]*\/([a-zA-Z0-9._]{3,10})$/;
      const match = topic.match(regEx);

      if (match?.length == 2) {
        setDevs((devs) =>
          devs.map((dev) => {
            if (dev.name == match[1]) {
              if (topic.includes('sonoff')) {
                const data = JSON.parse(payload.toString()) as any;
                return {
                  ...dev,
                  synced: true,
                  services: {
                    ...dev.services,
                    sonoff: dev.services.sonoff?.map((pin, i) => ({
                      ...pin,
                      synced: true,
                      state: !data[i],
                    })),
                  },
                };
              }

              if (topic.includes('door')) {
                return {
                  ...dev,
                  synced: true,
                  services: {
                    ...dev.services,
                    door: {
                      ...(dev.services.door as DoorService),
                      state: parseInt(payload.toString()),
                      synced: true,
                    },
                  },
                };
              }
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
      if (dev.services.sonoff) {
        mqtt.client?.publish(
          `${settings.mqttPrefix}/req/sonoff/${dev.name}`,
          ''
        );
      }

      if (dev.services.door) {
        mqtt.client?.publish(`${settings.mqttPrefix}/req/door/${dev.name}`, '');
      }
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

      let payloadData = devs[devIndex].services.sonoff?.map((_, i) =>
        i == digIndex ? 2 + 1 : 0
      );

      console.log(payloadData);

      mqtt.client.publish(
        `${settings.mqttPrefix}/req/sonoff/${devs[devIndex].name}`,
        JSON.stringify(payloadData)
      );
    }
  };

  const doorAction = (devIndex: number, action: number) => {
    setDevs((state) => {
      const newState = [...state];
      newState[devIndex].synced = false;
      // @ts-ignore
      newState[devIndex].services.door.synced = false;
      return newState;
    });

    mqtt.client?.publish(
      `${settings.mqttPrefix}/req/door/${devs[devIndex].name}`,
      `${action}`
    );
  };

  useEffect(() => syncData(), [mqtt.connected]);
  useEffect(() => {
    if (settings.ready) {
      if (!mqtt.connected) mqtt.connect(`wss://${settings.mqttUrl}`);
      setDevs(settings.devices);
      syncData();
    }
  }, [settings.ready]);

  return { mqtt, devs, setPin, doorAction };
};

export type Store = ReturnType<typeof useStore>;
