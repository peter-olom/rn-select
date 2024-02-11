import { useRef } from 'react';
import { Animated } from 'react-native';

type AnimationStrategy = 'fade' | 'spring';
type AnimationType = 'in' | 'out';

export default function useAnimations(
  strategy: AnimationStrategy = 'fade'
): [Animated.Value, (duration: number, type?: AnimationType) => void] {
  const value = useRef(new Animated.Value(0));

  switch (strategy) {
    case 'spring':
      return [
        value.current,
        (_, type: AnimationType = 'in') => {
          Animated.spring(value.current, {
            toValue: type === 'in' ? 1 : 0,
            useNativeDriver: true,
          }).start();
        },
      ];

    default:
      return [
        value.current,
        (duration = 1000, type: AnimationType = 'in') => {
          Animated.timing(value.current, {
            toValue: type === 'in' ? 1 : 0,
            duration,
            useNativeDriver: true,
          }).start();
        },
      ];
  }
}
