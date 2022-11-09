import { useEffect, useMemo, useRef } from 'react';
import { createStyles, Title, TextInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useLocalStorage } from '@mantine/hooks';
import { MdLink, MdLock, MdSave, MdSearch, MdDelete } from 'react-icons/md';
import { Screen } from '@/components/AppShell';
import { useMqttHelper } from '@/lib/mqtt';
import { getUnique } from '@/lib/utils';

export type DevInfo = {
  dev: string;
  uid: string;
  mac: string;
  pin: number;
};
export type DigiOut = { name: string; synced: boolean; state: boolean };

export interface Device {
  id: string;
  name: String;
  synced: boolean;
  digiouts: DigiOut[];
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
      const regEx = /^[\s\S]*\/res\/devinfo\/([0-9]*)$/;
      const match = topic.match(regEx);

      if (match?.length == 2) {
        const data = JSON.parse(payload.toString()) as DevInfo;
        const device: Device = {
          id: data.uid.toString(),
          name: data.mac,
          synced: false,
          digiouts: [...Array(data.pin)].map(
            (_, i): DigiOut => ({
              state: false,
              synced: false,
              name: `Switch ${i}`,
            })
          ),
        };

        devInfoRef.current.push(device);
        form.setFieldValue('ready', true);
        form.setFieldValue(
          'devices',
          getUnique([...form.values.devices, ...devInfoRef.current], 'id')
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
          <div key={dev.id} className={classes.deviceContainer}>
            <TextInput
              variant='filled'
              label='Device Name'
              {...form.getInputProps(`devices.${i}.name`)}
            />
            <div className={classes.digioutNamesContainer}>
              {dev.digiouts.map((_, ii) => (
                <TextInput
                  key={ii}
                  {...form.getInputProps(`devices.${i}.digiouts.${ii}.name`)}
                />
              ))}
            </div>
          </div>
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
