import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';

import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Select, type Option } from 'rn-select';

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
            <SelectPreview label="Multi Select" multi zIndex={2} />
            <SelectPreview label="Single Select" zIndex={1} />
            <SelectPreview label="No Options" optionsCount={0} />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
}

interface SelectPreviewProps {
  label: string;
  multi?: boolean;
  zIndex?: number;
  optionsCount?: number;
}
function SelectPreview({
  label,
  multi,
  zIndex,
  optionsCount = 50,
}: SelectPreviewProps) {
  const [options, setOptions] = useState<Option[]>([]);
  return (
    <View style={[styles.preview, { zIndex }]}>
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
        searchPlaceholder="Search Options"
        listTitle="Options"
        multi={multi}
        reverse
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
