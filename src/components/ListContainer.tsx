import React from 'react';
import type { ModalProps } from 'react-native';
import { Modal, Platform, SafeAreaView, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useStyles from '../hooks/useStyles';
import { View } from 'react-native';

interface Props extends ModalProps {}

export default function ListContainer({ children, style, ...rest }: Props) {
  const styles = useStyles(
    ({ tokens }) => ({
      optionsContainerNative: {
        flex: 1,
        backgroundColor: '#ffffff',
      },
      optionsContainerNativeInner: {
        flex: 1,
        paddingTop: tokens.size.sm,
        gap: tokens.size.sm,
      },
      optionsContainerWeb: {
        flex: 1,
        height: 400,
        paddingVertical: tokens.size.sm,
        marginTop: tokens.size.xl + tokens.size.sm,
        gap: tokens.size.sm,
        backgroundColor: '#ffffff',
        display: rest.visible ? 'flex' : 'none',
        borderRadius: tokens.size.sm / 2,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
    }),
    [rest.visible]
  );

  return Platform.select({
    web: (
      <View
        style={[StyleSheet.absoluteFill, styles.optionsContainerWeb, style]}
      >
        {children}
      </View>
    ),
    default: (
      <Modal {...rest}>
        <SafeAreaProvider>
          <SafeAreaView style={[styles.optionsContainerNative, style]}>
            <View style={styles.optionsContainerNativeInner}>{children}</View>
          </SafeAreaView>
        </SafeAreaProvider>
      </Modal>
    ),
  });
}
