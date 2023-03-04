import { useTopic } from '@/lib/mqtt';
import { ImPower } from 'react-icons/im';
import { useEffect, useState } from 'react';
import { useMqttConfig } from '@/lib/hooks';
import { MdBatteryUnknown } from 'react-icons/md';
import { Flex, Loader, Text } from '@mantine/core';
import { IoMdBatteryCharging } from 'react-icons/io';

function formatSeconds(seconds: number): string {
  if (seconds < 60) return 'Just now';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours ? hours + ' hours, ' : ''} ${minutes} minutes`;
}

export default function Power() {
  const [config] = useMqttConfig('mqtt-config');
  const [state, setState] = useState({ state: false, time: 0 });
  const [msg, _set, mqtt] = useTopic(`${config.secrat}/*/power`, true);

  useEffect(() => {
    if (msg == '') return;

    const data = msg.split(':');
    const _time = Math.floor(Date.now() / 1000) - parseInt(data[1]);

    setState({
      state: data[0] == '0' ? false : true,
      time: _time == 0 ? 1 : _time,
    });

    const handleTimeIncrement = () => {
      setState((_state) => ({ ..._state, time: _state.time + 60 }));
    };
    const _id = setInterval(handleTimeIncrement, 60000);
    return () => clearTimeout(_id);
  }, [msg]);

  return (
    <Flex h={28} align='center' gap='xs' style={{ flex: 0.5 }}>
      {state.time == 0 ? (
        <Loader size='sm' variant='dots' />
      ) : (
        <>
          <div style={{ transform: 'rotate(90deg)' }}>
            {state.state ? (
              <MdBatteryUnknown rotate='90deg' size={32} color='red' />
            ) : (
              <IoMdBatteryCharging rotate='90deg' size={32} color='green' />
            )}
          </div>
          <Text weight='bold' color={state.state ? 'red' : 'green'}>
            {formatSeconds(state.time)}
          </Text>
        </>
      )}
    </Flex>
  );
}
