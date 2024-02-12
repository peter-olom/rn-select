import React from 'react';
import type { PressableProps, ViewStyle } from 'react-native';
import { Pressable, Text, View, type TextStyle } from 'react-native';
import useStyles from '../hooks/useStyles';
import ChevronDownIcon from '../icons/ChevronDownIcon';
import type { IconStyle, Option } from '../types';
import Selections from './Selections';
import CloseIcon from '../icons/CloseIcon';

interface Props extends PressableProps {
  placeholder?: string;
  selected: Option[];
  multi: boolean;
  onRemove: (key: string) => void;
  onClear: () => void;
  selectStyle?: ViewStyle;
  selectPlaceholderTextStyle?: TextStyle;
  selectTextStyle?: TextStyle;
  selectPillTextStyle?: TextStyle;
  selectPillRemoveContainerStyle?: ViewStyle;
  selectPillRemoveIconStyle?: IconStyle;
  selectIconStyle?: IconStyle;
}

export default function Anchor({
  placeholder,
  selected,
  multi = false,
  onRemove,
  onClear,
  selectStyle,
  selectPlaceholderTextStyle,
  selectTextStyle,
  selectPillTextStyle,
  selectPillRemoveContainerStyle,
  selectPillRemoveIconStyle,
  selectIconStyle,
  ...rest
}: Props) {
  const styles = useStyles(
    ({ tokens, hairlineWidth }) => ({
      anchorContainer: {
        height: tokens.size.xl + 4,
        paddingLeft: tokens.size.xs,
        borderColor: '#c5c5c5',
        borderWidth: hairlineWidth,
        borderRadius: tokens.size.xs,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      icon: {
        width: selectIconStyle?.fontSize ?? tokens.size.sm,
        height: selectIconStyle?.fontSize ?? tokens.size.sm,
        paddingHorizontal: tokens.size.sm - 4,
      },
      iconContainer: { flexDirection: 'row', alignItems: 'center' },
      placeholder: { color: '#808080' },
      text: { fontSize: tokens.size.xs + 4 },
      closeIconContainer: {
        height: tokens.size.xl + 4,
        justifyContent: 'center',
      },
    }),
    [selectIconStyle]
  );

  return (
    <Pressable {...rest} style={[styles.anchorContainer, selectStyle]}>
      {selected.length === 0 && (
        <Text style={[styles.placeholder, selectPlaceholderTextStyle]}>
          {placeholder}
        </Text>
      )}
      {selected.length === 1 && !multi && (
        <Text style={[styles.text, selectTextStyle]}>{selected[0]?.[1]}</Text>
      )}
      {selected.length > 0 && multi && (
        <Selections
          items={selected}
          onRemove={onRemove}
          pillTextStyle={selectPillTextStyle}
          pillRemoveContainerStyle={selectPillRemoveContainerStyle}
          pillRemoveIconStyle={selectPillRemoveIconStyle}
        />
      )}
      <View style={styles.iconContainer}>
        {selected.length > 0 && (
          <Pressable style={styles.closeIconContainer} onPress={onClear}>
            <CloseIcon
              stroke={selectIconStyle?.color ?? '#c5c5c5'}
              style={styles.icon}
            />
          </Pressable>
        )}
        <ChevronDownIcon
          stroke={selectIconStyle?.color ?? '#c5c5c5'}
          style={styles.icon}
        />
      </View>
    </Pressable>
  );
}
