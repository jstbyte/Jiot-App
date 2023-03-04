import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';

export default function DarkMode() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <ActionIcon
      variant='subtle'
      color={dark ? 'yellow' : 'blue'}
      onClick={() => toggleColorScheme()}
      title='Toggle color scheme'
    >
      {dark ? <IoMdSunny size={28} /> : <IoMdMoon size={28} />}
    </ActionIcon>
  );
}
