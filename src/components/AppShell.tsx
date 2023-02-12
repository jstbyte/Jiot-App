import { Box } from '@mantine/core';
import { ReactNode, HtmlHTMLAttributes } from 'react';

interface Props extends HtmlHTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export const Body = ({ children }: Props) => (
  <div style={{ marginBottom: '3rem' }}>{children}</div>
);

export const Screen = ({ children, ...props }: Props) => (
  <Box
    component='div'
    sx={(theme) => ({ minHeight: 'calc(100vh - 3rem)' })}
    {...props}>
    {children}
  </Box>
);

export const NavBar = ({ children }: Props) => {
  return (
    <Box
      component='footer'
      sx={(theme) => ({
        height: '3rem',
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        display: 'grid',
        gap: '1px',
        gridAutoColumns: '1fr',
        gridAutoFlow: 'column',
        backgroundColor:
          theme.colorScheme == 'dark'
            ? theme.colors.dark[7]
            : theme.colors.gray[0],
        boxShadow: `0px -1px 1px ${
          theme.colorScheme == 'dark'
            ? theme.colors.dark[4]
            : theme.colors.gray[5]
        }`,
      })}>
      {children}
    </Box>
  );
};
