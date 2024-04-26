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
  placeholder,
  searchContainerStyle,
  searchInputStyle,
  searchBackIconStyle,
  searchClearIconStyle,
  ...rest
}: Props) {
  const ref = useRef<TextInput>(null);
  const [value, setValue] = useState('');
  const styles = useStyles(
    ({ tokens: { size } }) => ({
      container: {
        borderRadius: size.xs,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: size.sm,
      },
      inputWrapper: {
        flex: 1,
        height: size.xl,
      },
      input: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        borderRadius: size.xs,
        paddingRight: size.lg,
        paddingLeft: size.sm,
      },
      close: {
        marginLeft: -size.lg,
        width: searchClearIconStyle?.fontSize ?? size.md,
        height: searchClearIconStyle?.fontSize ?? size.md,
      },
      back: {
        width: searchBackIconStyle?.fontSize ?? size.lg,
        height: searchBackIconStyle?.fontSize ?? size.lg,
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
      <Pressable style={styles.inputWrapper}>
        <TextInput
          ref={ref}
          {...rest}
          placeholder={placeholder ?? 'Search...'}
          style={[styles.input, searchInputStyle]}
          onChangeText={(v) => {
            setValue(v);
            onChangeText?.(v);
          }}
        />
      </Pressable>
      {!!value && (
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
