import { useEffect, useMemo, useRef } from 'react';
import {
  createStyles,
  Title,
  TextInput,
  Button,
  CloseButton,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useLocalStorage } from '@mantine/hooks';
import { MdLink, MdLock, MdSave, MdSearch, MdDelete } from 'react-icons/md';
import { BsDoorOpenFill } from 'react-icons/bs';
import { ImSwitch } from 'react-icons/im';
import { Screen } from '@/components/AppShell';
import { useMqttHelper } from '@/lib/mqtt';
import { getUnique } from '@/lib/utils';
import { motion } from 'framer-motion';

export type SonoffService = { name: string; synced: boolean; state: boolean };
export type DoorService = { name: string; synced: boolean; state: number };
export type Services = { sonoff?: SonoffService[]; door?: DoorService };

/* Service Defination From Device Find */
interface DevInfo {
  mac: string;
  name: string;
  services: { name: string; data: any }[];
}

export interface Device {
  mac: string;
  name: string;
  synced: boolean;
  services: Services;
}

export interface SettingsType {
  ready: boolean;
  mqttUrl: string;
  mqttPrefix: string;
  devices: Device[];
}

const defaultSettings: SettingsType = {
  ready: false,
  mqttUrl: '',
  mqttPrefix: '',
  devices: [],
};

export const useSettings = () => {
  return useLocalStorage({
    key: 'settings',
    defaultValue: defaultSettings,
  });
};

export default function Settings() {
  const { classes } = useStyles();
  const [settings, setSettings] = useSettings();
  const devInfoRef = useRef<Device[]>([]);

  const form = useForm<SettingsType>({
    initialValues: {
      ready: true,
      mqttUrl: 'broker.emqx.io:8084/mqtt',
      mqttPrefix: '',
      devices: [],
    },
  });

  const mqtt = useMqttHelper(
    `${form.values.mqttPrefix}/res/devinfo/+`,
    (topic, payload) => {
      const regEx = /^[\s\S]*\/res\/devinfo\/([a-zA-Z0-9._]{3,10})$/;
      const match = topic.match(regEx);

      if (match?.length == 2) {
        let services: Services = {}; /* Store All Services */
        const device = JSON.parse(payload.toString()) as DevInfo;
        device.services.forEach((service) => {
          if (service.name == 'sonoff') {
            services[service.name] = [...Array(service.data as number)].map(
              (_, i) => ({
                state: false,
                synced: false,
                name: `Switch ${i}`,
              })
            );
            return;
          }

          /* Handle Other Service Case */
          if (service.name == 'door') {
            services.door = { name: 'Door Name', synced: false, state: 255 };
            return;
          }
        });

        devInfoRef.current.push({
          name: device.name,
          mac: device.mac,
          synced: false,
          services,
        });

        form.setFieldValue('ready', true);
        form.setFieldValue(
          'devices',
          getUnique([...form.values.devices, ...devInfoRef.current], 'name')
        );
      }
    }
  );

  const isClearable = useMemo(
    () =>
      form.values.mqttPrefix != settings.mqttPrefix &&
      form.values.devices.length,
    [form.values.devices, form.values.mqttPrefix]
  );

  const removeDevByIndex = (name: string) => () => {
    form.setFieldValue(
      'devices',
      form.values.devices.filter((dev) => dev.name != name)
    );
  };

  const handleFindOrClear = () => {
    devInfoRef.current = [];

    if (isClearable) {
      form.setFieldValue('ready', true);
      form.setFieldValue('devices', []);
      return;
    }

    if (mqtt.connected) {
      form.setFieldValue('ready', false);
      mqtt.client?.publish(`${form.values.mqttPrefix}/req/devinfo`, '');
    } else {
      form.setFieldValue('ready', true);
      mqtt.connect(`wss://${form.values.mqttUrl}`);
    }
  };

  useEffect(() => {
    if (!settings.ready) return;
    form.setValues({ ...settings });
  }, [settings.ready]);

  return (
    <form
      onSubmit={form.onSubmit((data) =>
        setSettings((state) => ({ ...state, ...data, ready: true }))
      )}>
      <Screen className={classes.root}>
        <Title order={2} className={classes.header}>
          Settings
        </Title>
        <TextInput
          label='Mqtt Broker Address'
          icon={<MdLink />}
          required
          {...form.getInputProps('mqttUrl')}
        />
        <TextInput
          type='password'
          label='Secrat Key'
          icon={<MdLock />}
          required
          {...form.getInputProps('mqttPrefix')}
        />
        <div className={classes.buttonsContainer}>
          <Button
            size='sm'
            style={{ flex: 1 }}
            leftIcon={
              isClearable ? (
                <MdDelete size={18} />
              ) : mqtt.connected ? (
                <MdSearch size={18} />
              ) : (
                <MdLink size={18} />
              )
            }
            disabled={mqtt.connected && !form.values.mqttPrefix}
            onClick={handleFindOrClear}
            loading={mqtt.connected && !form.values.ready}>
            {isClearable
              ? 'Clear Devices'
              : mqtt.connected
              ? 'Find Devices'
              : 'Connect Server'}
          </Button>
          <Button
            size='sm'
            style={{ flex: 1 }}
            type='submit'
            leftIcon={<MdSave />}
            disabled={!form.values.ready || !form.values.devices.length}>
            Save Devices
          </Button>
        </div>
        {form.values.devices.map((dev, i) => (
          <motion.div
            initial={{ opacity: 0, scaleY: 0.5, translateY: 100 }}
            animate={{ opacity: 1, scaleY: 1, translateY: 0 }}
            className={classes.deviceContainer}
            transition={{ delay: i * 0.075 }}
            key={dev.name}>
            <TextInput
              disabled
              variant='filled'
              className='dname'
              label='Device Name'
              size='md'
              rightSection={
                <CloseButton
                  color='red'
                  variant='subtle'
                  onClick={removeDevByIndex(dev.name)}
                />
              }
              {...form.getInputProps(`devices.${i}.name`)}
            />
            <div className={classes.digioutNamesContainer}>
              {dev.services.sonoff?.map((_, ii) => (
                <TextInput
                  key={ii}
                  icon={<ImSwitch />}
                  {...form.getInputProps(
                    `devices.${i}.services.sonoff.${ii}.name`
                  )}
                />
              ))}
            </div>
            {dev.services.door && (
              <div>
                <TextInput
                  icon={<BsDoorOpenFill />}
                  {...form.getInputProps(`devices.${i}.services.door.name`)}
                />
              </div>
            )}
          </motion.div>
        ))}
      </Screen>
    </form>
  );
}

const useStyles = createStyles((theme) => ({
  root: {
    maxWidth: theme.breakpoints.xs,
    margin: 'auto',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing.xs,
  },
  header: {
    color: theme.primaryColor,
    margin: theme.spacing.md,
    textAlign: 'center',
  },
  deviceContainer: {
    marginBottom: theme.spacing.md,
  },
  digioutNamesContainer: {
    borderTop: `3px solid ${theme.primaryColor}`,
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'stretch',
    gap: theme.spacing.md,
  },
}));
