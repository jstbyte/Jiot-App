import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  MantineThemeOverride,
} from '@mantine/core';
import App from '@/app';
import { StrictMode } from 'react';
import GlobalStyle from './styles';
import ReactDOM from 'react-dom/client';
import { Router } from './components/Router';
import { useLocalStorage } from './lib/hooks';

const theme: MantineThemeOverride = { primaryColor: 'green' };

const Main = () => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>(
    'color-scheme',
    'dark'
  );
  const toggle = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggle}>
      <MantineProvider
        withNormalizeCSS
        withGlobalStyles
        theme={{ ...theme, colorScheme }}>
        <GlobalStyle />
        <Router children={<App />} />
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

const container = document.getElementById('root');
ReactDOM.createRoot(container as HTMLElement).render(
  <StrictMode>
    <Main />
  </StrictMode>
);
