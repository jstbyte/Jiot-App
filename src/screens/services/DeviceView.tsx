import { useMemo } from 'react';
import { Accordion, Loader, Title, useMantineTheme } from '@mantine/core';
import { IoIosCloudDone } from 'react-icons/io';
import SonoffView from './SonoffView';
import { Store } from './store';

type Props = { store: Store };
export default function DeviceView({ store }: Props) {
  const theme = useMantineTheme();
  const primaryColor = useMemo(
    () =>
      theme.colors[theme.primaryColor][
        theme.fn.primaryShade(theme.colorScheme)
      ],
    [theme]
  );
  return (
    <Accordion defaultValue={store.devs[0].uid}>
      {store.devs.map((dev, devIndex) => (
        <Accordion.Item key={dev.uid} value={dev.uid}>
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
          <SonoffView {...{ store, devIndex, primaryColor }} />
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
