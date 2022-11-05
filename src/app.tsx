import { Body, NavBar } from '@/components/AppShell';
import { MdOutlineFindInPage } from 'react-icons/md';
import { FcHome, FcSettings } from 'react-icons/fc';
import { NavLink } from './components/NavLink';
import { Route } from './components/Router';
import { MqttProvider } from './lib/mqtt';
import Settings from './screens/settings';
import ESwitch from '@/screens/eswitch';

export default function App() {
  return (
    <MqttProvider>
      <Body>
        <Route path='/' component={<ESwitch />} />
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
