import { MdAddCircleOutline, MdDelete, MdEdit, MdSave } from 'react-icons/md';
import { ActionIcon, Text, Modal, TextInput, Title } from '@mantine/core';
import { Screen } from '@/components/AppShell';
import { createStyles } from '@mantine/core';
import { useLocalStorage, useMqttConfig } from '@/lib/hooks';
import { ICONS, IService } from './define';
import { useForm } from '@mantine/form';
import { getUnique } from '@/lib/utils';
import { AddService } from './service';
import { useState } from 'react';

type ModalData = { open: boolean; data?: IService };

export default function Settings() {
  const [services, setServices] = useLocalStorage<IService[]>('services', []);
  const [modal, setModal] = useState<ModalData>({ open: false });
  const [config, setConfig] = useMqttConfig('mqtt-config');
  const { classes } = useStyles();
  const form = useForm({
    initialValues: {
      mqttSecrat: config.secrat,
      services: [...services],
      mqttUrl: config.url,
    },
  });

  const saveMqttConfig = () => {
    setConfig({
      url: form.values.mqttUrl,
      secrat: form.values.mqttSecrat,
    });
  };

  const setService = (service: IService) => {
    const services =
      service.topic == modal?.data?.topic
        ? form.values.services.map((s) =>
            s.topic == service.topic ? service : s
          )
        : getUnique([...form.values.services, service], 'topic');

    form.setFieldValue('services', services);
    setModal({ open: false });
  };

  const saveServices = () => setServices(form.values.services);
  const remService = (i: number) => () => form.removeListItem('services', i);

  return (
    <Screen className={classes.root}>
      <Title order={4} align='center' color='green'>
        Device & Service Settings
      </Title>
      <TextInput
        required
        label='Enter Mqtt Url'
        {...form.getInputProps('mqttUrl')}
        onBlur={saveMqttConfig}
      />
      <TextInput
        required
        type='password'
        label='Enter Topic Secrat'
        {...form.getInputProps('mqttSecrat')}
        onBlur={saveMqttConfig}
      />

      {form.values.services.map((service, i) => {
        const Icon = ICONS[service.icon];
        return (
          <div key={service.topic} className={classes.services}>
            <Icon size={24} />
            <Text className={classes.serviceTopic}>{service.topic}</Text>
            <ActionIcon onClick={() => setModal({ open: true, data: service })}>
              <MdEdit color='yellow' />
            </ActionIcon>
            <ActionIcon onClick={remService(i)}>
              <MdDelete color='red' />
            </ActionIcon>
          </div>
        );
      })}

      <div className={classes.addButtonContainer}>
        <ActionIcon size='xl' onClick={() => setModal({ open: true })}>
          <MdAddCircleOutline size={28} />
        </ActionIcon>
        <ActionIcon size='xl' onClick={saveServices}>
          <MdSave size={28} />
        </ActionIcon>
      </div>

      <Modal
        opened={modal.open}
        onClose={() => setModal({ open: false })}
        title='Service Setup'>
        <AddService onSubmit={setService} value={modal.data} />
      </Modal>
    </Screen>
  );
}

const useStyles = createStyles((theme) => ({
  root: {
    maxWidth: theme.breakpoints.xs,
    margin: 'auto',
    padding: '1rem',
    display: 'flex',
    overflowX: 'hidden',
    alignItems: 'stretch',
    gap: theme.spacing.xs,
    flexDirection: 'column',
  },
  services: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing.xs,
    boxShadow: theme.shadows.md,
  },
  serviceTopic: {
    flex: 1,
    overflow: 'hidden',
    fontStyle: 'italic',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    marginLeft: theme.spacing.sm,
  },
  addButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
