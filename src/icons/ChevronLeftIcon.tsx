import * as React from 'react';
import Svg, { type SvgProps, Path } from 'react-native-svg';

const ChevronLeftIcon = (props: SvgProps) => (
  <Svg
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    viewBox="0 0 24 24"
    {...props}
  >
    <Path d="m15 18-6-6 6-6" />
  </Svg>
);
export default ChevronLeftIcon;
