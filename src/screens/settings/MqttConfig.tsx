import { useMqttConfig } from '@/lib/hooks';
import { TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

export default function MqttConfig() {
  const [config, setConfig] = useMqttConfig('mqtt-config');
  const form = useForm({ initialValues: { ...config } });
  const handleSave = () => setConfig(form.values);

  return (
    <>
      <TextInput
        required
        label='Enter Mqtt Url'
        {...form.getInputProps('url')}
        onBlur={handleSave}
      />
      <TextInput
        required
        type='password'
        label='Enter Topic Secrat'
        {...form.getInputProps('secrat')}
        onBlur={handleSave}
      />
    </>
  );
}
