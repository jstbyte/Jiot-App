import { createStyles, Global, MantineTheme } from '@mantine/core';

export default function GlobalStyle() {
  return (
    <Global
      styles={(theme) => ({
        '*, *::before, *::after': { boxSizing: 'border-box' },
        'a, a:hover, a:focus, a:active': {
          textDecoration: 'none',
          color: 'inherit',
        },
      })}
    />
  );
}
