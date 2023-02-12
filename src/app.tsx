import { Body, NavBar } from '@/components/AppShell';
import { FcHome, FcSettings } from 'react-icons/fc';
import { NavLink } from '@/components/NavLink';
import { Route } from '@/components/Router';
import { MqttProvider } from '@/lib/mqtt';
import Settings from '@/screens/settings';
import Services from '@/screens/services';
import Update from './screens/update';

export default function App() {
  return (
    <MqttProvider>
      <Body>
        <Route path='/' component={<Services />} />
        <Route path='/update' component={<Update />} />
        <Route path='/settings' component={<Settings />} />
      </Body>

      <NavBar>
        <NavLink
          href='/'
          replace
          name='Home'
          component={'home'}
          icon={FcHome}
        />
        <NavLink
          href='/settings'
          replace
          name='Settings'
          component={'Setting'}
          icon={FcSettings}
        />
      </NavBar>
    </MqttProvider>
  );
}
