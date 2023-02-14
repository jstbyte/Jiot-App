import { MantineProvider, MantineThemeOverride } from '@mantine/core';
import { Router } from './components/Router';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import GlobalStyle from './styles';
import App from '@/app';
import { isDarkMode } from './lib/utils';

const theme: MantineThemeOverride = {
  colorScheme: isDarkMode() ? 'dark' : 'light',
  primaryColor: 'green',
};

const container = document.getElementById('root');
ReactDOM.createRoot(container as HTMLElement).render(
  <StrictMode>
    <MantineProvider withNormalizeCSS withGlobalStyles theme={theme}>
      <GlobalStyle />
      <Router children={<App />} />
    </MantineProvider>
  </StrictMode>
);
