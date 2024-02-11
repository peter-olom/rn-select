import * as React from 'react';
import Svg, { type SvgProps, Path } from 'react-native-svg';

const CheckIcon = (props: SvgProps) => (
  <Svg
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    viewBox="0 0 24 24"
    {...props}
  >
    <Path d="M20 6 9 17l-5-5" />
  </Svg>
);
export default CheckIcon;
