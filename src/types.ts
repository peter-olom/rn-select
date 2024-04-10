import type { LayoutRectangle, TextStyle } from 'react-native';

export type Option = [string, string];

export type IconStyle = Pick<TextStyle, 'color' | 'fontSize'>;

export type AnchorPos = Partial<{
  x: number;
  y: number;
  width: number;
}>;

export type LayoutRect = LayoutRectangle & {
  left?: number;
  top?: number;
};
