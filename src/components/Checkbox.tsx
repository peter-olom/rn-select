import React from 'react';
import { View } from 'react-native';
import useStyles from '../hooks/useStyles';
import { Pressable } from 'react-native';
import CheckIcon from '../icons/CheckIcon';
import { Platform } from 'react-native';
import type { PressableProps } from 'react-native';

interface Props extends PressableProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  checked?: boolean;
  inactiveColor?: string;
  activeColor?: string;
  checkColor?: string;
}
export default function Checkbox({
  size = 'sm',
  checked,
  inactiveColor = '#c5c5c5',
  activeColor = '#1616FF',
  checkColor = '#fff',
  ...rest
}: Props) {
  const styles = useStyles(
    ({ tokens }) => ({
      container: Platform.select({
        ios: {
          width: tokens.size[size],
          height: tokens.size[size],
          justifyContent: 'center',
          alignItems: 'center',
        },
        default: {
          width: tokens.size[size],
          height: tokens.size[size],
          borderWidth: 1,
          borderColor: inactiveColor,
          borderRadius: tokens.size[size] / 4,
          justifyContent: 'center',
          alignItems: 'center',
          ...(checked && {
            borderColor: activeColor,
            backgroundColor: activeColor,
          }),
        },
      }),
      icon: Platform.select({
        ios: {
          width: tokens.size[size],
          height: tokens.size[size],
        },
        default: {
          width: tokens.size[size] - 4,
          height: tokens.size[size] - 4,
        },
      }),
    }),
    [size, checked]
  );
  const stroke = Platform.select({
    ios: checked ? activeColor : '#0000',
    default: checked ? checkColor : '#0000',
  });

  return (
    <Pressable {...rest}>
      <View style={styles.container}>
        <CheckIcon stroke={stroke} style={styles.icon} />
      </View>
    </Pressable>
  );
}
