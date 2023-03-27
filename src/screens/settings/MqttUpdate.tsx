import { useTopic } from '@/lib/mqtt';
import { useEffect, useState } from 'react';
import { useMqttConfig } from '@/lib/hooks';
import { MdCloudDownload, MdUpdate, MdCloudDone } from 'react-icons/md';
import { Box, Button, Flex, TextInput, createStyles } from '@mantine/core';

/* Test Component */
export default function MqttUpdate() {
  const { classes } = useStyles();
  const [config] = useMqttConfig('mqtt-config');
  const [device, setDevice] = useState<string>('');
  const [binary, setBinary] = useState<string>('');
  const [version, ___setVersion, mqtt] = useTopic(
    `${config.secrat}/${device}/res/update`,
    true
  );

  const handleDevice = (e: any) => setDevice(e.target.value);
  const handleBinary = (e: any) => setBinary(e.target.value);
  const testDev = () => /^[a-zA-Z0-9_-]{3,16}$/.test(device);
  useEffect(() => mqtt.connect(`wss://${config.url}`), []);

  useEffect(() => {
    mqtt.client?.subscribe(`${config.secrat}/+/res/update`);
    return () => {
      mqtt.client?.unsubscribe(`${config.secrat}/+/res/update`);
    };
  }, [mqtt.client]);

  const handleVersion = () => {
    if (!testDev()) return alert('Invalid Device Name!');
    mqtt.client?.publish(`${config.secrat}/${device}/req/update`, ``);
  };
  const handleUpdate = () => {
    if (!testDev()) return alert('Invalid Device Name');
    if (!/^https:\/\/([a-z0-9-]+\.)+[a-z]{2,}(:\d{1,5})?(\/.*)?$/.test(binary))
      return alert('Invalid Binary Url!');
    mqtt.client?.publish(`${config.secrat}/${device}/req/update`, binary);
  };

  return (
    <Box>
      <Flex className={classes.form}>
        <TextInput
          required
          label='Device Name'
          onBlur={handleDevice}
          placeholder='Case Sensitive...'
        />
        <TextInput
          required
          label='Binary Url'
          onBlur={handleBinary}
          placeholder='Binary firmware url including method...'
        />
        <Flex justify='center' gap='md'>
          <Button
            mt='xs'
            variant='outline'
            onClick={handleVersion}
            disabled={mqtt.status != 'connected' || !!version}
            leftIcon={
              version ? (
                <MdCloudDone size={18} />
              ) : (
                <MdCloudDownload size={18} />
              )
            }
          >
            {version ? version : 'Version'}
          </Button>
          <Button
            mt='xs'
            variant='outline'
            onClick={handleUpdate}
            leftIcon={<MdUpdate size={18} />}
            disabled={mqtt.status != 'connected' || !binary}
          >
            Update
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}

const useStyles = createStyles((theme) => ({
  form: {
    margin: 'auto',
    gap: theme.spacing.xs,
    flexDirection: 'column',
    justifyContent: 'center',
    maxWidth: theme.breakpoints.xs,
  },
}));
