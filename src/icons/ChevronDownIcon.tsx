import * as React from 'react';
import Svg, { type SvgProps, Path } from 'react-native-svg';

const ChevronDownIcon = (props: SvgProps) => (
  <Svg
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    viewBox="0 0 24 24"
    {...props}
  >
    <Path d="m6 9 6 6 6-6" />
  </Svg>
);
export default ChevronDownIcon;
