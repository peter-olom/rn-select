import React, { useRef, useState } from 'react';
import type { TextStyle, ViewStyle } from 'react-native';
import type { TextInputProps } from 'react-native';
import { TextInput, View } from 'react-native';
import ChevronLeft from '../icons/ChevronLeftIcon';
import { Pressable } from 'react-native';
import Close from '../icons/CloseIcon';
import useStyles from '../hooks/useStyles';
import type { IconStyle } from '../types';

interface Props extends Omit<TextInputProps, 'style'> {
  onBackPress?: () => void;
  searchContainerStyle?: ViewStyle;
  searchInputStyle?: TextStyle;
  searchBackIconStyle?: IconStyle;
  searchClearIconStyle?: IconStyle;
}
export default function SearchBox({
  onBackPress,
  onChangeText,
  searchContainerStyle,
  searchInputStyle,
  searchBackIconStyle,
  searchClearIconStyle,
  ...rest
}: Props) {
  const ref = useRef<TextInput>(null);
  const [value, setValue] = useState('');
  const styles = useStyles(
    ({ tokens }) => ({
      container: {
        borderRadius: tokens.size.xs,
        flexDirection: 'row',
        alignItems: 'center',
      },
      input: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        borderRadius: tokens.size.xs,
        height: tokens.size.xl + 4,
        paddingRight: tokens.size.lg,
        paddingLeft: tokens.size.sm,
      },
      close: {
        marginLeft: -tokens.size.lg,
        width: searchClearIconStyle?.fontSize ?? tokens.size.md,
        height: searchClearIconStyle?.fontSize ?? tokens.size.md,
      },
      back: {
        width: searchBackIconStyle?.fontSize ?? tokens.size.lg,
        height: searchBackIconStyle?.fontSize ?? tokens.size.lg,
      },
    }),
    []
  );

  const clearText = () => {
    ref.current?.clear();
    setValue('');
    onChangeText?.('');
  };

  return (
    <View style={[styles.container, searchContainerStyle]}>
      {onBackPress && (
        <Pressable onPress={onBackPress}>
          <ChevronLeft
            stroke={searchBackIconStyle?.color ?? '#c5c5c5'}
            style={styles.back}
          />
        </Pressable>
      )}
      <TextInput
        {...rest}
        ref={ref}
        style={[styles.input, searchInputStyle]}
        onChangeText={(v) => {
          setValue(v);
          onChangeText?.(v);
        }}
      />
      {value && (
        <Pressable onPress={clearText}>
          <Close
            stroke={searchClearIconStyle?.color ?? '#c5c5c5'}
            style={styles.close}
          />
        </Pressable>
      )}
    </View>
  );
}
