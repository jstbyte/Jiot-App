import { useMemo } from 'react';
import { Accordion, Loader, Title, useMantineTheme } from '@mantine/core';
import { IoIosCloudDone } from 'react-icons/io';
import SonoffView from './Sonoff';
import { Store } from './store';
import Door from './Door';

type Props = { store: Store };
export default function Devices({ store }: Props) {
  const theme = useMantineTheme();
  const primaryColor = useMemo(
    () =>
      theme.colors[theme.primaryColor][
        theme.fn.primaryShade(theme.colorScheme)
      ],
    [theme]
  );
  return (
    <Accordion defaultValue={store.devs[0].name}>
      {store.devs.map((dev, devIndex) => (
        <Accordion.Item key={dev.name} value={dev.name}>
          <Accordion.Control
            icon={
              dev.synced ? (
                <IoIosCloudDone
                  size={theme.spacing.xl}
                  color={theme.primaryColor}
                />
              ) : (
                <Loader size={theme.spacing.xl} />
              )
            }>
            <Title order={5} color={theme.primaryColor}>
              {dev.name}
            </Title>
          </Accordion.Control>
          {dev.services.sonoff && (
            <SonoffView {...{ store, devIndex, primaryColor }} />
          )}
          {dev.services.door && <Door {...{ store, devIndex, primaryColor }} />}
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
