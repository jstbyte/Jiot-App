import { Button, Group, JsonInput } from '@mantine/core';
import { useState } from 'react';
import { IService } from './define';

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
    </>
  );
}
