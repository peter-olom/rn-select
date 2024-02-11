import React from 'react';
import type { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

interface Props {
  children: ReactNode;
}

export default function SelectProvider({ children }: Props) {
  return (
    <SafeAreaProvider>
      <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
    </SafeAreaProvider>
  );
}
