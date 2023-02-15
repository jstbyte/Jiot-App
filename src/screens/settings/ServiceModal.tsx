import {
  Button,
  Group,
  Select,
  TextInput,
  Textarea,
  Text,
} from '@mantine/core';
import { IService, SERVICES, ICONS } from './define';
import { useForm } from '@mantine/form';

type ServiceModalPros = { onSubmit: (arg: IService) => any; value?: IService };
export function ServiceModal({ onSubmit, value }: ServiceModalPros) {
  const handleSubmit = (v: IService) => onSubmit(v);
  const form = useForm<IService>({
    initialValues: value || {
      name: 'SONOFF',
      icon: 'SOCKET',
      topic: '',
      data: '',
    },
  });

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      {!!value?.topic ? (
        <Text weight='bold' color='violet'>
          {value.topic}
        </Text>
      ) : (
        <TextInput
          required
          label='Topic'
          {...form.getInputProps('topic')}
          placeholder='Enter a unique topic'
          disabled={!!value?.topic}
        />
      )}
      <Select
        required
        data={[...SERVICES]}
        label='Name'
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
