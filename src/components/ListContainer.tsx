import React from 'react';
import type { ModalProps } from 'react-native';
import { Modal, SafeAreaView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useStyles from '../hooks/useStyles';
import { View } from 'react-native';
import { Platform } from 'react-native';
import { Pressable } from 'react-native';
import type { AnchorPos } from '../types';
import { useWindowDimensions } from 'react-native';

interface Props extends ModalProps {
  position?: AnchorPos;
}

export default function ListContainer({
  children,
  style,
  position,
  ...rest
}: Props) {
  const { width } = useWindowDimensions();
  const willBleed = (position?.x ?? 0) + 280 > width;

  const left = willBleed ? undefined : position?.x ?? 0;
  const right = willBleed
    ? width - ((position?.x ?? 0) + (position?.width ?? 0))
    : undefined;
  const top = position?.y ?? 0;

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
          <SafeAreaView style={[styles.optionsContainer, style]}>
            <View style={styles.optionsContainerInner}>{children}</View>
          </SafeAreaView>
        </SafeAreaProvider>
      </Pressable>
    </Modal>
  );
}
