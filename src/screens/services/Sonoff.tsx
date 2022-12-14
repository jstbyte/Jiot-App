import { Accordion, Text, Switch, createStyles } from '@mantine/core';
import { MdElectricalServices, MdError } from 'react-icons/md';
import { Device } from '../settings';
import { Store } from './store';

interface Props {
  store: Store;
  devIndex: number;
  primaryColor: string;
}

export default function Sonoff({ store, devIndex, primaryColor }: Props) {
  const { classes, theme } = useStyles();
  return (
    <Accordion.Panel>
      {store.devs[devIndex].services.sonoff?.map((digiout, digIndex) => (
        <div className={classes.button} key={digiout.name + devIndex}>
          <MdElectricalServices
            size={theme.spacing.xl * 1.1}
            color={primaryColor}
          />
          <Text
            className='button-label'
            size={theme.fontSizes.md}
            color={primaryColor}>
            {digiout.name}
          </Text>
          <Switch
            onLabel='ON'
            offLabel='OFF'
            size='lg'
            thumbIcon={
              digiout.synced ? null : <MdError size={20} color='red' />
            }
            // disabled={!digiout.synced}
            onClick={() => store.setPin(devIndex, digIndex, digiout.state)}
            checked={digiout.state}
          />
        </div>
      ))}
    </Accordion.Panel>
  );
}
const useStyles = createStyles((theme) => ({
  button: {
    display: 'flex',
    justifyContent: 'stretch',
    alignItems: 'center',
    boxShadow: theme.shadows.md,
    padding: theme.spacing.xs,
    borderRadius: theme.radius.md,
    '& .button-label': {
      flex: 1,
      textAlign: 'center',
      fontWeight: 600,
    },
  },
}));
