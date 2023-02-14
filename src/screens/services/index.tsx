import { createStyles, Title, Image, Loader, Box, Flex } from '@mantine/core';
import { useLocalStorage, useMqttConfig } from '@/lib/hooks';
import { IService, SERVICE_STORE } from '../settings/define';
import Containers from '@/components/Containers';
import { Screen } from '@/components/AppShell';
import { useSubscription } from '@/lib/mqtt';
import { useEffect, useMemo } from 'react';

export default function Services() {
  const { classes, theme } = useStyles();
  const [config] = useMqttConfig('mqtt-config');
  const [_services] = useLocalStorage<IService[]>('services', []);
  const mqtt = useSubscription([`${config.secrat}/+/req/sonoff`]);
  useEffect(() => mqtt.connect(`wss://${config.url}`), []);
  const services = useMemo(() => {
    return _services.map((service) => ({
      ...service,
      topic: `${config.secrat}/${service.topic}`,
    }));
  }, [_services]);

  return (
    <Screen className={classes.root}>
      <Flex justify='center' align='center' pos='sticky'>
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
      </Flex>
      <Containers.Grid p='xs'>
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
    gap: theme.spacing.xs,
    flexDirection: 'column',
  },
  loaderContainer: {
    paddingTop: theme.spacing.xl * 3,
    display: 'flex',
    justifyContent: 'center',
  },
}));
