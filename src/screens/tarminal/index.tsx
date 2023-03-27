import { useState } from 'react';
import { Screen } from '@/components/AppShell';
import {
  Box,
  TextInput,
  Text,
  Center,
  Button,
  Group,
  Flex,
  Container,
  Title,
  Textarea,
  Divider,
} from '@mantine/core';
import { useMqtt, useTopic } from '@/lib/mqtt';
import { useMqttConfig } from '@/lib/hooks';

export default function Tarminal() {
  const [config] = useMqttConfig('mqtt-config');
  const [topic, setTopic] = useState('');
  const [data, setData] = useState('');
  const [sub, setSub] = useState('');
  const mqtt = useMqtt();
  const [msg] = useTopic(`${config.secrat}/${sub}`, true);

  const handleSubmit = () => {
    mqtt.client?.publish(`${config.secrat}/${topic}`, data);
  };

  return (
    <Screen>
      <Title align='center'>Tarminal</Title>
      <Text align='center' color='blue'>
        {mqtt.status}
      </Text>

      <Container size='sm'>
        <TextInput
          required
          label='Publish Topic'
          value={topic}
          placeholder='Publish to Topic...'
          onChange={(v) => setTopic(v.target.value)}
        />

        <Textarea
          value={data}
          label='Data to Publish'
          placeholder='Anything as text...'
          onChange={(v) => setData(v.target.value)}
        />

        <Flex justify='end' mt='md'>
          <Button onClick={handleSubmit} disabled={mqtt.status != 'connected'}>
            Send
          </Button>
        </Flex>
        <Divider my='md' />
        <TextInput
          label='Subscribe Topic'
          onBlur={(v) => setSub(v.target.value)}
          placeholder='Any topic to subscribe...'
        />
        <Text align='center' my='md' p='sm'>
          {msg}
        </Text>
      </Container>
    </Screen>
  );
}
