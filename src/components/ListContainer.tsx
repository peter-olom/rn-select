import React, { useEffect, useMemo, useState } from 'react';
import type { ModalProps } from 'react-native';
import { Modal, SafeAreaView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useStyles from '../hooks/useStyles';
import { View } from 'react-native';
import { Platform } from 'react-native';
import { Pressable } from 'react-native';
import type { AnchorPos } from '../types';
import { useWindowDimensions } from 'react-native';
import type { ViewProps } from 'react-native';
import { MIN_WIDTH } from './common';

interface Props extends ModalProps {
  position?: AnchorPos;
}

export default function ListContainer({
  children,
  style,
  position,
  ...rest
}: Props) {
  const { width, height } = useWindowDimensions();
  const [listHeight, setListHeight] = useState(0);

  // will bleed horizontally
  const willBleed = (position?.x ?? 0) + MIN_WIDTH > width;
  const left = willBleed ? undefined : position?.x ?? 0;
  const right = willBleed
    ? width - ((position?.x ?? 0) + (position?.width ?? 0))
    : undefined;

  const top = useMemo(() => {
    if (height - (position?.y ?? 0) < listHeight + 80) {
      return height - listHeight - 80;
    }
    return position?.y ?? 0;
  }, [height, listHeight, position?.y]);

  const styles = useStyles(
    ({ tokens }) => ({
      backdrop: {
        flex: 1,
      },
      optionsContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
        ...Platform.select({
          default: {},
          web: {
            top,
            left,
            right,
            maxHeight: 400,
            position: 'absolute',
            paddingVertical: tokens.size.sm,
            marginTop: tokens.size.xl + tokens.size.sm,
            gap: tokens.size.sm,
            backgroundColor: '#ffffff',
            borderRadius: tokens.size.sm / 2,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          },
        }),
      },
      optionsContainerInner: {
        flex: 1,
        paddingTop: tokens.size.sm,
        gap: tokens.size.sm,
      },
    }),
    [left, right, top]
  );

  return (
    <Modal {...rest}>
      <Pressable style={styles.backdrop} onPress={rest.onRequestClose}>
        <SafeAreaProvider>
          <ListContent
            style={[styles.optionsContainer, style]}
            onListHeight={setListHeight}
          >
            <View style={styles.optionsContainerInner}>{children}</View>
          </ListContent>
        </SafeAreaProvider>
      </Pressable>
    </Modal>
  );
}

interface Props extends ViewProps {
  onListHeight?: (height: number) => void;
}
function ListContent({ onListHeight, ...rest }: Props) {
  const [containerRef, setContainerRef] = useState<View | null>(null);

  useEffect(() => {
    const onViewLayout = () => {
      containerRef?.measure((_x, _y, _w, h, _pageX, _pageY) => {
        onListHeight?.(h);
      });
    };
    onViewLayout();
  }, [containerRef, onListHeight]);

  return <SafeAreaView ref={setContainerRef} {...rest} />;
}
