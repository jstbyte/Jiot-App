import { IService, ServiceKeys } from '@/screens/settings/define';
import Sonoff from './Sonoff';

export type ServiceProps = { service: IService };
export type Element = (props: ServiceProps) => JSX.Element;
export type ServiceStore = { [name in ServiceKeys]: Element };

export const SERVICE_STORE: ServiceStore = {
  SONOFF: Sonoff,
};
