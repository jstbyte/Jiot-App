import { Link } from '@/components/NavLink';
import { Button, Flex, Text } from '@mantine/core';
import { BiError } from 'react-icons/bi';

export default function Empty() {
  return (
    <Flex justify='center' align='center' direction='column' mt={12}>
      <BiError size={128} color='red' />
      <Text weight='bold' color='red'>
        Device / Service Not Configured!
      </Text>
      <Link href='/settings' replace>
        <Button variant='subtle' my={6}>
          Go To Settings
        </Button>
      </Link>

      <a href='https://github.com/jstbyte/Jiot-App' target='_blank'>
        <Text color='yellow'>Went to see source code ?</Text>
      </a>
    </Flex>
  );
}
