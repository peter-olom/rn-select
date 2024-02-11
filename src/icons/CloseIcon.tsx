import * as React from 'react';
import Svg, { type SvgProps, Path } from 'react-native-svg';

const CloseIcon = (props: SvgProps) => (
  <Svg
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    viewBox="0 0 24 24"
    {...props}
  >
    <Path d="M18 6 6 18M6 6l12 12" />
  </Svg>
);
export default CloseIcon;
