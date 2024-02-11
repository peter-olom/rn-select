import React, { useState, useEffect } from 'react';
import { Keyboard, View } from 'react-native';
import useStyles from '../hooks/useStyles';

export default function BottomSpacer() {
  const [height, setHeight] = useState(0);
  const styles = useStyles(
    () => ({
      container: {
        height: height,
        transform: [{ scaleY: 0 }],
      },
    }),
    [height]
  );
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () =>
      setHeight(Keyboard.metrics()?.height ?? 300)
    );
    Keyboard.addListener('keyboardDidHide', () => setHeight(0));
  });
  return <View style={[styles.container]} />;
}
