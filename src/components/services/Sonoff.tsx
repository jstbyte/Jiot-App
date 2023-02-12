import {
  keyframes,
  createStyles,
  Text,
  ActionIcon,
  Center,
} from '@mantine/core';
import { useSubscription } from '@/lib/mqtt';
import { ServiceProps } from '.';
import { useEffect, useState } from 'react';
import { ICONS } from '@/screens/settings/define';

type SonoffState = { name: string; state: boolean; busy: boolean };

export default function Sonoff({ service }: ServiceProps) {
  const [pins, setPins] = useState<SonoffState[]>(() =>
    service.data.split(';').map((name) => ({
      state: false,
      busy: true,
      name,
    }))
  );

  const mqtt = useSubscription([service.topic], (t, p: any) => {
    setPins((_pins) => {
      const newPins = [..._pins]; // Copy Data;
      (p.toString() as string).split(';').forEach((e) => {
        const d = e.split(':');
        const index = parseInt(d[0]);
        if (index < pins.length) {
          newPins[index] = {
            ...newPins[index],
            state: d[1] == '0' ? true : false,
            busy: false,
          };
        }
      });
      return newPins;
    });
  });

  const handleChange = async (index: number) => {
    setPins((_pins) => {
      const newPins = [..._pins];
      newPins[index] = { ...newPins[index], busy: true };
      return newPins;
    });

    mqtt.client?.publish(
      `${service.topic.replace('/res/', '/req/')}`,
      `${index}:3`
    );
  };

  useEffect(() => {
    if (mqtt.status != 'connected') return;
    mqtt.client?.publish(`${service.topic.replace('/res/', '/req/')}`, ``);
  }, [mqtt.client, mqtt.status]);

  const { classes, theme } = useStyles();
  return (
    <>
      {pins.map((pin, i) => {
        const Icon = ICONS[service.icon];
        return (
          <div key={pin.name + i} className={classes.sonoffContainer}>
            <Center>
              <ActionIcon
                size={48}
                radius='xl'
                onClick={() => handleChange(i)}
                className={
                  pin.busy
                    ? classes.iconBusy
                    : pin.state
                    ? classes.iconOn
                    : classes.iconOff
                }>
                {pin.busy ? (
                  <Icon size={36} color='gray' className={classes.icon} />
                ) : pin.state ? (
                  <Text color={theme.colors.green[5]} weight='bold'>
                    ON
                  </Text>
                ) : (
                  <Text color={theme.colors.red[5]} weight='bold'>
                    OFF
                  </Text>
                )}
              </ActionIcon>
            </Center>
            <Text align='center' lineClamp={2} size='sm' pt='xs' weight={600}>
              {pin.name}
            </Text>
          </div>
        );
      })}
    </>
  );
}

const pulse = keyframes`
from, 20%, 53%, 80%, to {
  scale: 1;
}

40%, 43% {
  scale: 0.5;
}

70% {
  scale: 0.9;
}

90% {
  scale: 1;
}
`;

const useStyles = createStyles((theme) => ({
  sonoffContainer: {
    borderRadius: theme.radius.sm,
    boxShadow: theme.shadows.md,
    padding: theme.spacing.xs,
  },
  pushButton: {
    borderRadius: '100%',
    padding: theme.spacing.xs,
  },
  iconOn: {
    borderRadius: '100%',
    boxShadow: `1px 1px 5px ${theme.colors.green[5]}`,
  },
  iconOff: {
    borderRadius: '100%',
    boxShadow: `0px 0px 5px ${theme.colors.red[5]}`,
  },
  iconBusy: {
    borderRadius: '100%',
    boxShadow: `0px 0px 5px ${theme.colors.gray[5]}`,
  },
  icon: {
    animation: `${pulse} 1s ease infinite`,
  },
}));
