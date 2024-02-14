import React, { useCallback } from 'react';
import useStyles from '../hooks/useStyles';
import type { IconStyle, Option } from '../types';
import {
  Pressable,
  View,
  FlatList,
  Text,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import CloseIcon from '../icons/CloseIcon';

export interface Props {
  items: Option[];
  onRemove: (key: string) => void;
  pillTextStyle?: TextStyle;
  pillRemoveContainerStyle?: ViewStyle;
  pillRemoveIconStyle?: IconStyle;
}
export default function Selections({
  items,
  onRemove,
  pillTextStyle,
  pillRemoveContainerStyle,
  pillRemoveIconStyle,
}: Props) {
  const renderItem = useCallback(
    ({ item: [key, val] }: { item: Option }) => (
      <SelectionChip
        value={val}
        handleRemove={() => onRemove(key)}
        textStyle={pillTextStyle}
        removeContainerStyle={pillRemoveContainerStyle}
        removeIconStyle={pillRemoveIconStyle}
      />
    ),
    [onRemove, pillRemoveContainerStyle, pillRemoveIconStyle, pillTextStyle]
  );

  return (
    <FlatList
      horizontal
      data={items}
      keyExtractor={([key]: Option) => key}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
    />
  );
}

export interface SelectionChipProps {
  value: string;
  handleRemove: () => void;
  textStyle?: TextStyle;
  removeContainerStyle?: ViewStyle;
  removeIconStyle?: IconStyle;
}
function SelectionChip({
  value,
  handleRemove,
  textStyle,
  removeContainerStyle,
  removeIconStyle,
}: SelectionChipProps) {
  const styles = useStyles(
    ({ tokens }) => ({
      container: {
        justifyContent: 'center',
        height: tokens.size.xl,
        paddingRight: tokens.size.sm,
      },
      pillContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: tokens.size.sm,
        overflow: 'hidden',
      },
      text: {
        paddingHorizontal: tokens.size.xs,
        paddingVertical: tokens.size.xs / 2,
        backgroundColor: '#f1f1f1',
      },
      close: {
        height: '100%',
        flexDirection: 'row',
        backgroundColor: '#b3b3b3',
        alignItems: 'center',
        justifyContent: 'center',
        width: tokens.size.md,
      },
      closeIcon: {
        width: removeIconStyle?.fontSize ?? tokens.size.sm,
        height: removeIconStyle?.fontSize ?? tokens.size.sm,
      },
    }),
    [removeIconStyle]
  );
  return (
    <Pressable style={[styles.container]}>
      <View style={styles.pillContainer}>
        <Text style={[styles.text, textStyle]}>{value}</Text>
        <Pressable
          style={[styles.close, removeContainerStyle]}
          onPress={handleRemove}
        >
          <CloseIcon
            stroke={removeIconStyle?.color ?? '#ffffff'}
            style={styles.closeIcon}
          />
        </Pressable>
      </View>
    </Pressable>
  );
}
