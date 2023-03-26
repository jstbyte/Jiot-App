import { MdOutlinePowerSettingsNew } from 'react-icons/md';
import Sonoff from '@/screens/services/Sonoff';
import { IoMdBulb } from 'react-icons/io';
import { FaFan } from 'react-icons/fa';
import Door from '../services/Door';

export const SERVICES = ['SONOFF', 'DOOR'] as const;

export const ICONS = Object.freeze({
  FAN: FaFan,
  LIGHT: IoMdBulb,
  SOCKET: MdOutlinePowerSettingsNew,
});

export const SERVICE_STORE: ServiceStore = {
  SONOFF: Sonoff,
  DOOR: Door,
};

/* Type Defications */
export type ServiceStore = { [name in ServiceKeys]: Element };
export type Element = (props: ServiceProps) => JSX.Element;
export type ServiceKeys = typeof SERVICES[number];
export type ServiceProps = { service: IService };
export interface IService {
  topic: string; // as UID;
  icon: keyof typeof ICONS;
  name: ServiceKeys;
  data: string;
}
