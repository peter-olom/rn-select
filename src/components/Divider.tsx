import React from 'react';
import { View } from 'react-native';
import useStyles from '../hooks/useStyles';

export default function Divider() {
  const styles = useStyles(
    ({ hairlineWidth }) => ({
      divider: {
        height: hairlineWidth,
        backgroundColor: 'rgba(197, 197, 197, 0.5)',
      },
    }),
    []
  );
  return <View style={[styles.divider]} />;
}
