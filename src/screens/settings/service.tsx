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

type AddServicePros = { onSubmit: (arg: IService) => any; value?: IService };
export function AddService({ onSubmit, value }: AddServicePros) {
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
          label='Service Topic'
          {...form.getInputProps('topic')}
          placeholder='Enter a unique topic'
          disabled={!!value?.topic}
        />
      )}
      <Select
        required
        data={[...SERVICES]}
        label='Service Name'
        placeholder='Please Select One'
        {...form.getInputProps('name')}
      />
      <Select
        required
        label='Service Icon'
        placeholder='Please Select One'
        data={[...Object.keys(ICONS)]}
        {...form.getInputProps('icon')}
      />
      <Textarea
        required
        label='Service Data'
        {...form.getInputProps('data')}
        placeholder='Enter Service Spacific Data'
      />

      <Group position='center' my='md'>
        <Button type='submit'>Save</Button>
      </Group>
    </form>
  );
}
