import { useMemo, type DependencyList } from 'react';
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

const tokens = {
  size: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  },
} as const;

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle };

interface UseStyleProps {
  hairlineWidth: number;
  tokens: typeof tokens;
}

interface UseStyleFunc<T extends NamedStyles<T> | NamedStyles<any>> {
  (props: UseStyleProps): T | NamedStyles<T>;
}

export default function useStyles<T extends NamedStyles<T> | NamedStyles<any>>(
  cb: UseStyleFunc<T>,
  deps: DependencyList
) {
  return useMemo(
    () => cb({ tokens, hairlineWidth: StyleSheet.hairlineWidth }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cb, ...deps]
  );
}
