import { MdOutlinePowerSettingsNew } from 'react-icons/md';
import { IoMdBulb } from 'react-icons/io';
import { FaFan } from 'react-icons/fa';

export const SERVICES = ['SONOFF'] as const;

export const ICONS = Object.freeze({
  FAN: FaFan,
  LIGHT: IoMdBulb,
  SOCKET: MdOutlinePowerSettingsNew,
});

/* Type Defications */
export type ServiceKeys = typeof SERVICES[number];
export interface IService {
  topic: string; // as UID;
  icon: keyof typeof ICONS;
  name: ServiceKeys;
  data: string;
}
