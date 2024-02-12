import React from 'react';
import {
  Animated,
  Pressable,
  Text,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import useAnimations from '../hooks/useAnimation';
import useStyles from '../hooks/useStyles';
import Checkbox from './Checkbox';
import type { PressableProps } from 'react-native';

export interface OptionColors {
  inactiveColor?: string;
  activeColor?: string;
  checkColor?: string;
}

export interface Props extends PressableProps {
  value: string;
  onPress: () => void;
  multi: boolean;
  checked: boolean;
  selectionEffectColor?: string;
  reverse?: boolean;
  optionContainerStyle?: ViewStyle;
  optionTextStyle?: TextStyle;
  optionCheckColors?: OptionColors;
}
export default function SelectRow({
  value,
  onPress,
  multi,
  checked,
  selectionEffectColor = '#d3d3d3',
  reverse,
  optionContainerStyle,
  optionTextStyle,
  optionCheckColors,
  ...rest
}: Props) {
  const [animatedValue, fade] = useAnimations('fade');
  const styles = useStyles(
    () => ({
      itemContainer: {
        paddingVertical: multi ? 16 : 20,
        paddingHorizontal: 8,
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 12,
        justifyContent: 'space-between',
        zIndex: 10,
        gap: 6,
        position: 'relative',
        ...(reverse && {
          justifyContent: 'flex-end',
          flexDirection: 'row-reverse',
        }),
      },
      clickOverlay: {
        position: 'absolute',
        backgroundColor: selectionEffectColor,
        opacity: animatedValue,
        left: 0,
        zIndex: 1,
        width: '100%',
        height: '100%',
      },
      showIcon: {
        ...(!multi && !checked && { opacity: 0 }),
      },
    }),
    [multi, animatedValue, reverse]
  );
  return (
    <>
      <Animated.View style={[styles.clickOverlay]} />
      <Pressable
        {...rest}
        style={[styles.itemContainer, optionContainerStyle]}
        onPress={onPress}
        onPressIn={() => fade(500)}
        onPressOut={() => fade(500, 'out')}
        onHoverIn={() => fade(500)}
        onHoverOut={() => fade(500, 'out')}
      >
        <Text style={optionTextStyle}>{value}</Text>
        <Checkbox
          style={[styles.showIcon]}
          checked={checked}
          onPress={onPress}
          {...optionCheckColors}
        />
      </Pressable>
    </>
  );
}
