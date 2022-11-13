import { Accordion, Button, createStyles, Text } from '@mantine/core';
import {
  MdLockClock,
  MdLock,
  MdLockOpen,
  MdLockOutline,
  MdVpnKey,
} from 'react-icons/md';
import { useLocalStorage } from '@mantine/hooks';
import { useEffect, useRef, useState } from 'react';
import { DoorService } from '../settings';
import { Store } from './store';

interface Props {
  store: Store;
  devIndex: number;
  primaryColor: string;
}

export default function Door({ store, devIndex, primaryColor }: Props) {
  const [_timeout, _setTimeout] = useState(0);
  const onChangeTimeout = (e: any) => {
    // @ts-ignore
    _setTimeout(e.target.value);
  };

  const setDoorTimer = () => {
    const value = parseInt(
      prompt('Door Open & Set Lock Timer (in seconds)') as string
    );
    if (value && value > 0) {
      store.doorAction(devIndex, value);
    }
  };
  const door = store.devs[devIndex].services.door as DoorService;
  const { classes } = useStyles();
  return (
    <Accordion.Panel>
      <div className={classes.root}>
        {door?.state == 255 ? (
          <div className={classes.buttonContainer}>
            <Button
              onClick={() => store.doorAction(devIndex, 0)}
              leftIcon={<MdVpnKey />}
              className='item'>
              Open Door
            </Button>
            <Button
              onClick={() => store.doorAction(devIndex, 1)}
              leftIcon={<MdLock />}
              className='item'>
              Lock Door
            </Button>
          </div>
        ) : (
          <div className={classes.buttonContainer}>
            <Button
              onClick={setDoorTimer}
              leftIcon={<MdLockClock />}
              disabled={!door.synced || !door.state || door.state > 1}
              className='item'>
              Set Timer
            </Button>
            <Button
              onClick={() => store.doorAction(devIndex, 255)}
              leftIcon={door.state ? <MdLock /> : <MdVpnKey />}
              className='item'>
              {door.state ? 'Lock Door' : 'Open Door'}
            </Button>
          </div>
        )}
      </div>
    </Accordion.Panel>
  );
}

const useStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    gap: theme.spacing.md,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& .item': {
      flex: 1,
    },
  },
}));
