import {
  keyframes,
  createStyles,
  Text,
  ActionIcon,
  Center,
  Box,
} from '@mantine/core';
import { res2req, useTopic } from '@/lib/mqtt';
import { useEffect, useState } from 'react';
import Containers from '@/components/Containers';
import { ICONS, ServiceProps } from '@/screens/settings/define';

function parsePins(pins: SonoffState[], msg: string) {
  const newPins = [...pins]; // Copy Data;
  (msg.toString() as string).split(';').forEach((e) => {
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
}

type SonoffState = { name: string; state: boolean; busy: boolean };
export default function Sonoff({ service: s }: ServiceProps) {
  const [msg, _set, mqtt] = useTopic(s.topic, false);
  const [pins, setPins] = useState<SonoffState[]>(() =>
    s.data.split(';').map((name) => ({
      state: false,
      busy: true,
      name,
    }))
  );

  useEffect(() => setPins((_pins) => parsePins(pins, msg)), [msg]);

  const handleChange = async (index: number) => {
    setPins((_pins) => {
      const newPins = [..._pins];
      newPins[index] = { ...newPins[index], busy: true };
      return newPins;
    });

    mqtt.client?.publish(res2req(s.topic), `${index}:3`);
  };

  const { classes, theme } = useStyles();
  return (
    <>
      {pins.map((pin, i) => {
        const Icon = ICONS[s.icon];
        return (
          <Containers.Col key={pin.name + i} topic={s.topic}>
            <Center>
              <Box className={classes.pushButtonConatiner}>
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
                  }
                >
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
              </Box>
            </Center>
            <Text align='center' truncate size='xs' pt='xs' weight={600}>
              {pin.name}
            </Text>
          </Containers.Col>
        );
      })}
    </>
  );
}

const pulse = keyframes`from, 20%, 53%, 80%, to {scale: 1;}
  40%, 43% {scale: 0.7;} 70% {scale: 0.9;} 90% {scale: 1;}`;

const useStyles = createStyles((theme) => ({
  pushButtonConatiner: {
    padding: 4,
    overflow: 'hidden',
    borderRadius: '100%',
    border: `1px solid ${
      theme.colorScheme == 'light' ? theme.colors.gray[0] : theme.colors.gray[9]
    }`,
  },
  pushButton: {
    borderRadius: '100%',
    padding: theme.spacing.xs,
  },
  iconOn: {
    borderRadius: '100%',
    boxShadow: `0px 0px 10px ${theme.colors.green[5]}`,
  },
  iconOff: {
    borderRadius: '100%',
    boxShadow: `0px 0px 10px ${theme.colors.red[5]}`,
  },
  iconBusy: {
    borderRadius: '100%',
    boxShadow: `0px 0px 10px ${theme.colors.gray[5]}`,
  },
  icon: {
    animation: `${pulse} 1s ease infinite`,
  },
}));
