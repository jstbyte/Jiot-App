import { Box, BoxProps } from '@mantine/core';
import { PolymorphicComponentProps } from '@mantine/utils';

type ServiceProps = PolymorphicComponentProps<'div', BoxProps>;

function Services(props: ServiceProps) {
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

function Service(props: ServiceProps) {
  return (
    <Box
      {...props}
      sx={(theme) => ({
        boxShadow: theme.shadows.md,
        borderRadius: theme.radius.sm,
        padding: theme.spacing.xs,
      })}>
      {props.children}
    </Box>
  );
}

export default { Grid: Services, Col: Service };
