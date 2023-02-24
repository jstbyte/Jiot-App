import { useMqtt } from '@/lib/mqtt';
import { useEffect, useMemo } from 'react';
import DarkMode from '@/components/DarkMode';
import { Screen } from '@/components/AppShell';
import Containers from '@/components/Containers';
import { getLS, useMqttConfig } from '@/lib/hooks';
import { IService, SERVICE_STORE } from '../settings/define';
import { createStyles, Title, Image, Loader, Flex } from '@mantine/core';

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
      <Flex justify='center' align='center' pos='sticky' py={2}>
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
        <DarkMode />
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
