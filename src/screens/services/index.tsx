import { createStyles, Title, Image, Loader } from '@mantine/core';
import { useStore } from './store';
import { Screen } from '@/components/AppShell';
import Devices from './Devices';

export default function Services() {
  const { classes, theme } = useStyles();
  const store = useStore();

  return (
    <Screen className={classes.root}>
      <div className={classes.status}>
        <Image src='/images/brand.ico' width={28} />
        <Title order={2} className={classes.header}>
          Jiot
        </Title>
      </div>
      {store.devs.length > 0 ? (
        <Devices store={store} />
      ) : (
        <div className={classes.loaderContainer}>
          <Loader size={128} variant='bars' />
        </div>
      )}
    </Screen>
  );
}

const useStyles = createStyles((theme) => ({
  root: {
    maxWidth: theme.breakpoints.xs,
    margin: 'auto',

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing.xs,
  },
  header: {
    textAlign: 'center',
    color: theme.primaryColor,
    margin: theme.spacing.xs,
  },
  status: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    paddingTop: theme.spacing.xl * 3,
    display: 'flex',
    justifyContent: 'center',
  },
}));
