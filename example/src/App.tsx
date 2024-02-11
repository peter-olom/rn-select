import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';

import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Select, type Option, SelectProvider } from 'rn-select';

export default function App() {
  return (
    <>
      <StatusBar />
      <GestureHandlerRootView style={styles.main}>
        <SafeAreaProvider>
          <SelectProvider>
            <SafeAreaView style={[styles.container]}>
              <Content multi />
              <Content />
            </SafeAreaView>
          </SelectProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </>
  );
}

function Content({ multi }: { multi?: boolean }) {
  const [options, setOptions] = useState<Option[]>([]);
  return (
    <Select
      options={Array(50)
        .fill(0)
        .map((_, index) => [`value-${index}`, `Available Option ${index + 1}`])}
      value={options}
      onChangeValue={setOptions}
      placeholder="Select Option"
      searchPlaceholder="Search Options"
      listTitle="Options"
      multi={multi}
    />
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  container: {
    padding: 16,
    flex: 1,
    gap: 16,
  },
});
