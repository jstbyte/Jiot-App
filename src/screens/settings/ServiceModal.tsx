import {
  Button,
  Group,
  Select,
  TextInput,
  Textarea,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IService, SERVICES, ICONS, SERVICE_STORE } from './define';

type ServiceModalPros = { onSubmit: (arg: IService) => any; value?: IService };
export function ServiceModal({ onSubmit, value }: ServiceModalPros) {
  const form = useForm<IService>({
    initialValues: value || {
      name: 'SONOFF',
      icon: 'SOCKET',
      topic: '',
      data: '',
    },
  });

  const handleSubmit = (v: IService) => {
    const topic = !value?.topic
      ? `${v.topic}/res/${SERVICE_STORE[v.name].topic}`
      : v.topic;

    onSubmit({ ...v, topic });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      {!!value?.topic ? (
        <Text weight='bold' color='violet'>
          {value.topic}
        </Text>
      ) : (
        <TextInput
          required
          label='Device Name'
          disabled={!!value?.topic}
          {...form.getInputProps('topic')}
          placeholder='Device name, no space or spacial chars.'
        />
      )}
      <Select
        required
        data={[...SERVICES]}
        label='Service Type'
        disabled={!!value?.name}
        placeholder='Please Select One'
        {...form.getInputProps('name')}
      />
      <Select
        required
        label='Icon'
        placeholder='Please Select One'
        data={[...Object.keys(ICONS)]}
        {...form.getInputProps('icon')}
      />
      <Textarea
        required
        autosize
        minRows={1}
        maxRows={5}
        label='Service Data'
        {...form.getInputProps('data')}
        placeholder='Enter Service Spacific Data'
      />

      <Group position='center' my='md'>
        <Button type='submit' variant='outline'>
          Save
        </Button>
      </Group>
    </form>
  );
}
