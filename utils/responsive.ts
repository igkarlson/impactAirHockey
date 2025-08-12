import { Dimensions } from 'react-native';

export const BASE_WIDTH = 360;
export const BASE_HEIGHT = 640;

const getWindow = () => Dimensions.get('window');

export const deviceWidth = () => getWindow().width;
export const deviceHeight = () => getWindow().height;

export const scaleX = deviceWidth() / BASE_WIDTH;
export const scaleY = deviceHeight() / BASE_HEIGHT;
export const minScale = Math.min(scaleX, scaleY);

export const hs = (size: number) => (deviceWidth() / BASE_WIDTH) * size;
export const vs = (size: number) => (deviceHeight() / BASE_HEIGHT) * size;
export const ms = (size: number, factor = 0.5) => size + (hs(size) - size) * factor;
export const mns = (size: number) => Math.min(deviceWidth() / BASE_WIDTH, deviceHeight() / BASE_HEIGHT) * size;


