import { MdOutlinePowerSettingsNew } from 'react-icons/md';
import Sonoff from '@/screens/services/Sonoff';
import { IoMdBulb } from 'react-icons/io';
import { FaFan } from 'react-icons/fa';
import Door from '../services/Door';

export const ICONS = Object.freeze({
  FAN: FaFan,
  LIGHT: IoMdBulb,
  SOCKET: MdOutlinePowerSettingsNew,
});

export const SERVICE_STORE = Object.freeze({
  SONOFF: { topic: 'sonoff', view: Sonoff },
  DOOR: { topic: 'servo', view: Door },
});

export const SERVICES = Object.keys(SERVICE_STORE) as unknown as ServiceKeys;
/* Type Defications */
export type ServiceStore = {
  [name in ServiceKeys]: { topic: string; view: Element };
};
export type Element = (props: ServiceProps) => JSX.Element;
export type ServiceKeys = keyof typeof SERVICE_STORE;
export type ServiceProps = { service: IService };
export interface IService {
  topic: string; // as UID;
  icon: keyof typeof ICONS;
  name: ServiceKeys;
  data: string;
}
