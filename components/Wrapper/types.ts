import { ViewStyle } from 'react-native';

import { COUNTRIES } from './constants';

export interface AppState {
  apiData: string;
  isConnected: boolean;
  isLoading: boolean;
  isWv: boolean;
}

export interface Config {
  api: string;
  backgroundColor: ViewStyle['backgroundColor'];
  blackListIso2?: (keyof typeof COUNTRIES)[];
  onHide?: () => void;
  whiteListIso2?: (keyof typeof COUNTRIES)[];
}
