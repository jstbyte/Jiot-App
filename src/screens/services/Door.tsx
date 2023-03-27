import { useState } from 'react';
import { res2req, useTopic } from '@/lib/mqtt';
import Containers from '@/components/Containers';
import { ServiceProps } from '../settings/define';
import { FaLock, FaUnlock, FaInfoCircle } from 'react-icons/fa';
import { Box, Button, Center, Loader } from '@mantine/core';

export default function Door({ service: s }: ServiceProps) {
  const [msg, _set, mqtt] = useTopic(s.topic, true);
  const [option] = useState(() => {
    try {
      const params = s.data.split(':');
      return { lock: params[0] || '0', unlock: params[1] || '180' };
    } catch (error) {
      return { lock: '180', unlock: '0' };
    }
  });

  const toggle = () => {
    if (msg == option.lock) {
      mqtt.client?.publish(res2req(s.topic), option.unlock);
    } else if (msg == option.unlock) {
      mqtt.client?.publish(res2req(s.topic), option.lock);
    } else {
      mqtt.client?.publish(res2req(s.topic), option.lock);
    }
  };

  return (
    <Containers.Col topic={s.topic}>
      {msg == '' ? (
        <Center mt='md'>
          <Loader />
        </Center>
      ) : (
        <Box>
          <Center my='sm'>
            {msg == '255' ? (
              <FaInfoCircle color='yellow' size={32} />
            ) : msg == option.lock ? (
              <FaLock color='green' size={32} />
            ) : (
              <FaUnlock color='red' size={32} />
            )}
          </Center>
          <Center>
            <Button fullWidth size='xs' variant='subtle' onClick={toggle}>
              {msg == '255' ? 'Lock' : msg == option.unlock ? 'Lock' : 'Unlock'}
            </Button>
          </Center>
        </Box>
      )}
    </Containers.Col>
  );
}
