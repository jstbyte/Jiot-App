import { Body, NavBar } from '@/components/AppShell';
import { FcHome, FcSettings } from 'react-icons/fc';
import { NavLink } from '@/components/NavLink';
import { MdDashboard } from 'react-icons/md';
import { Route } from '@/components/Router';
import { MqttProvider } from '@/lib/mqtt';
import Settings from '@/screens/settings';
import Services from '@/screens/services';
import Tarminal from './screens/tarminal';

export default function App() {
  return (
    <MqttProvider>
      <Body>
        <Route path='/' component={<Services />} />
        <Route path='/settings' component={<Settings />} />
        <Route path='/tarminal' component={<Tarminal />} />
      </Body>

      <NavBar>
        <NavLink replace href='/' title='Dashboard' icon={MdDashboard} />
        <NavLink replace href='/settings' title='Settings' icon={FcSettings} />
      </NavBar>
    </MqttProvider>
  );
}
