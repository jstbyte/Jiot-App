import { useState } from 'react';
import { IService } from './define';
import { MdScience } from 'react-icons/md';
import { Link } from '@/components/NavLink';
import { ActionIcon, Button, Center, Group, JsonInput } from '@mantine/core';

interface JsonEditerProps {
  onSave: (value: IService[]) => any;
  data: IService[];
}

export default function JsonEditer({ data, onSave }: JsonEditerProps) {
  const [services, setServices] = useState(JSON.stringify(data, null, 2));
  const handleSave = () => onSave(JSON.parse(services));
  return (
    <>
      <JsonInput
        autosize
        minRows={4}
        maxRows={10}
        formatOnBlur
        value={services}
        validationError='Invalid json'
        onChange={(v) => setServices(v)}
        placeholder='[ Past or Write services inside ]'
      />
      <Group position='center' pt='md'>
        <Button onClick={handleSave} variant='outline'>
          Save Config
        </Button>
      </Group>

      <Center mt='xl'>
        <Link href='/tarminal'>
          <ActionIcon size='xl'>
            <MdScience size={32} color='red' />
          </ActionIcon>
        </Link>
      </Center>
    </>
  );
}
