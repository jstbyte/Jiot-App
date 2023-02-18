import { PolymorphicComponentProps } from '@mantine/utils';
import { Box, BoxProps, Text } from '@mantine/core';
import { useMemo } from 'react';

type ServicesProps = PolymorphicComponentProps<'div', BoxProps>;
function Services(props: ServicesProps) {
  return (
    <Box
      {...props}
      sx={(theme) => ({
        gap: 3,
        display: 'grid',
        gridAutoRows: theme.spacing.xl * 5,
        gridTemplateColumns: `repeat(auto-fit,minmax(${
          theme.spacing.xl * 5
        }px,1fr))`,
      })}>
      {props.children}
    </Box>
  );
}

type ServiceProps = ServicesProps & { topic: string };
function Service({ topic, ...props }: ServiceProps) {
  const dev = useMemo(() => topic.split('/')[1], [topic]);
  return (
    <Box
      {...props}
      sx={(theme) => ({
        position: 'relative',
        boxSizing: 'border-box',
        boxShadow: theme.shadows.xs,
        borderRadius: theme.radius.sm,
        padding: theme.spacing.xs / 2,
        border: `1px solid ${
          theme.colorScheme == 'light'
            ? theme.colors.gray[1]
            : theme.colors.gray[8]
        }`,
      })}>
      <Text truncate size={10} mb={2}>
        {dev}
      </Text>
      {props.children}
    </Box>
  );
}

export default { Grid: Services, Col: Service };
