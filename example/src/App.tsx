import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';

import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Select } from 'rn-select';

export default function App() {
  const { width } = useWindowDimensions();
  return (
    <>
      <StatusBar />
      <SafeAreaProvider>
        <SafeAreaView style={[styles.main]}>
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={[styles.container, { width: width > 480 ? 480 : width }]}
          >
            <Text style={styles.header}>RN Select</Text>
            <MultiSelect label="Multi Select" />
            <SingleSelect label="Single Select" optionsCount={3} />
            <SingleSelect label="No Options" optionsCount={0} />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
}

interface SingleSelectProps {
  label: string;
  zIndex?: number;
  optionsCount?: number;
}
function SingleSelect({ label, optionsCount = 50 }: SingleSelectProps) {
  const [options, setOptions] = useState<string>('');
  return (
    <View style={[styles.preview]}>
      <Text>{label}</Text>
      <Select
        options={Array(optionsCount)
          .fill(0)
          .map((_, index) => [
            `value-${index}`,
            `Available Option ${index + 1}`,
          ])}
        value={options}
        onChangeValue={setOptions}
        placeholder="Select Option"
        searchPlaceholder="Search Available Options"
        listTitle="Options"
        reverse
      />
    </View>
  );
}

interface MultiSelectProps {
  label: string;
  optionsCount?: number;
}
function MultiSelect({ label, optionsCount = 50 }: MultiSelectProps) {
  const [options, setOptions] = useState<string[]>([]);

  return (
    <View style={styles.preview}>
      <Text>{label}</Text>
      <Select
        options={Array(optionsCount)
          .fill(0)
          .map((_, index) => [
            `value-${index}`,
            `Available Option ${index + 1}`,
          ])}
        value={options}
        onChangeValue={setOptions}
        placeholder="Select Option"
        searchPlaceholder="Search Available Options"
        listTitle="Options"
        reverse
        multi
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 16,
    gap: 16,
    marginTop: -180,
  },
  header: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 12,
  },
  preview: {
    gap: 8,
  },
});
