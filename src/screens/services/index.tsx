import { useMqtt } from '@/lib/mqtt';
import { useEffect, useMemo } from 'react';
import DarkMode from '@/components/DarkMode';
import { Screen } from '@/components/AppShell';
import Containers from '@/components/Containers';
import { getLS, useMqttConfig } from '@/lib/hooks';
import { IService, SERVICE_STORE } from '../settings/define';
import {
  createStyles,
  Title,
  Image,
  Loader,
  Flex,
  Center,
  Box,
} from '@mantine/core';
import Power from './Power';

function getServices(secrat: string) {
  return getLS<IService[]>('services', []).map((service) => ({
    ...service,
    topic: `${secrat}/${service.topic}`,
  }));
}

export default function Services() {
  const { classes, theme } = useStyles();
  const [config] = useMqttConfig('mqtt-config');
  const mqtt = useMqtt([`${config.secrat}/+/res/sonoff`]);
  useEffect(() => mqtt.connect(`wss://${config.url}`), []);
  const services = useMemo(() => getServices(config.secrat), []);

  return (
    <Screen className={classes.root}>
      <Flex className={classes.head}>
        {mqtt.status != 'reconnecting' ? (
          <Image
            src='/images/brand.ico'
            width={28}
            opacity={mqtt.status == 'connected' ? 1 : 0.5}
          />
        ) : (
          <Loader size={28} />
        )}
        <Title mx='xs' order={2} color={theme.primaryColor}>
          Jiot
        </Title>
        <Power />
      </Flex>

      <Containers.Grid className={classes.services}>
        {services.map((s) => {
          const Comp = SERVICE_STORE[s.name];
          return <Comp key={s.topic} service={s} />;
        })}
      </Containers.Grid>
    </Screen>
  );
}

const useStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  head: {
    boxShadow: '0 0 5px gray',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'sticky',
    height: `3rem`,
    width: 'full',
    padding: 2,
  },
  loaderContainer: {
    paddingTop: theme.spacing.xl * 3,
    display: 'flex',
    justifyContent: 'center',
  },
  services: {
    maxHeight: 'calc(100vh - 6rem)',
    padding: theme.spacing.xs,
    overflowY: 'auto',
  },
}));
