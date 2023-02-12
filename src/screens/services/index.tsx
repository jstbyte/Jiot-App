import { createStyles, Title, Image, Loader } from '@mantine/core';
import { useLocalStorage, useMqttConfig } from '@/lib/hooks';
import { IService, SERVICE_STORE } from '../settings/define';
import Containers from '@/components/Containers';
import { Screen } from '@/components/AppShell';
import { useSubscription } from '@/lib/mqtt';
import { useEffect, useMemo } from 'react';

export default function Services() {
  const { classes } = useStyles();
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
      <div className={classes.status}>
        {mqtt.status != 'reconnecting' ? (
          <Image
            src='/images/brand.ico'
            width={28}
            opacity={mqtt.status == 'connected' ? 1 : 0.5}
          />
        ) : (
          <Loader size={28} />
        )}
        <Title order={2} className={classes.header}>
          Jiot
        </Title>
      </div>
      <Containers.Grid>
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
    margin: theme.spacing.sm,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing.xs,
  },
  header: {
    textAlign: 'center',
    color: theme.primaryColor,
    margin: theme.spacing.xs,
  },
  status: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    paddingTop: theme.spacing.xl * 3,
    display: 'flex',
    justifyContent: 'center',
  },
}));
