import React from 'react';
import { View } from 'react-native';
import useStyles from '../hooks/useStyles';

interface Props {
  height?: number;
}
export default function BottomSpacer({ height = 50 }: Props) {
  const styles = useStyles(
    () => ({
      spacer: {
        height,
      },
    }),
    [height]
  );
  return <View style={[styles.spacer]} />;
}
