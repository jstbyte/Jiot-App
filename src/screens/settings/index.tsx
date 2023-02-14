import {
  MdAddCircleOutline,
  MdCheck,
  MdDelete,
  MdEdit,
  MdSave,
} from 'react-icons/md';
import {
  ActionIcon,
  Text,
  Modal,
  TextInput,
  Title,
  Tabs,
  JsonInput,
  Group,
  Button,
  Flex,
  CopyButton,
} from '@mantine/core';
import { Screen } from '@/components/AppShell';
import { createStyles } from '@mantine/core';
import { ICONS, IService } from './define';
import { useForm } from '@mantine/form';
import { getUnique } from '@/lib/utils';
import { ServiceModal } from './ServiceModal';
import { useEffect, useState } from 'react';
import { useLocalStorage, useMqttConfig } from '@/lib/hooks';
import JsonEditer from './JsonEditer';
import MqttConfig from './MqttConfig';

type ModalData = { open: boolean; data?: IService };

export default function Settings() {
  const [services, setServices] = useLocalStorage<IService[]>('services', []);
  const [modal, setModal] = useState<ModalData>({ open: false });
  const { classes } = useStyles(); /* jss Styled classes */

  const setService = (service: IService) => {
    const _services =
      service.topic == modal?.data?.topic
        ? services.map((s) => (s.topic == service.topic ? service : s))
        : getUnique([...services, service], 'topic');

    setModal({ open: false });
    setServices(_services);
  };

  const remService = (i: number) => () => {
    const _services = [...services];
    _services.splice(i, 1);
    setServices(_services);
  };

  return (
    <Screen className={classes.root}>
      <Title order={4} align='center' color='green'>
        Device & Service Settings
      </Title>
      <MqttConfig />

      <Tabs defaultValue='basic' keepMounted={false}>
        <Tabs.List grow>
          <Tabs.Tab value='basic'>Basic</Tabs.Tab>
          <Tabs.Tab value='advance'>Advance</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='basic'>
          {services.map((service, i) => {
            const Icon = ICONS[service.icon];
            return (
              <div key={service.topic} className={classes.services}>
                <Icon size={24} />
                <Text className={classes.serviceTopic}>{service.topic}</Text>
                <ActionIcon
                  onClick={() => setModal({ open: true, data: service })}>
                  <MdEdit color='yellow' />
                </ActionIcon>
                <ActionIcon onClick={remService(i)}>
                  <MdDelete color='red' />
                </ActionIcon>
              </div>
            );
          })}
          <Group position='center' pt='md'>
            <Button
              leftIcon={<MdAddCircleOutline size={24} />}
              onClick={() => setModal({ open: true })}
              variant='outline'>
              Add
            </Button>
          </Group>
        </Tabs.Panel>

        <Tabs.Panel value='advance'>
          <JsonEditer data={services} onSave={setServices} />
        </Tabs.Panel>
      </Tabs>

      <Modal
        opened={modal.open}
        onClose={() => setModal({ open: false })}
        title='Service Setup'>
        <ServiceModal onSubmit={setService} value={modal.data} />
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
}));
