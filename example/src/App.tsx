import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';

import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Select } from '@devrue/rn-select';

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
            <MultiSelect label="Creatable Select" creatable optionsCount={5} />
            <MultiSelect
              label="Disabled Select"
              optionsCount={10}
              defaults={['value-3', 'value-7']}
              disabled
            />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
}

interface SingleSelectProps {
  label: string;
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
        searchPlaceholderTextColor="gray"
        listTitle="Options"
        reverse
      />
    </View>
  );
}

interface MultiSelectProps {
  label: string;
  optionsCount?: number;
  creatable?: boolean;
  disabled?: boolean;
  defaults?: string[];
}
function MultiSelect({
  label,
  optionsCount = 50,
  creatable,
  disabled,
  defaults = [],
}: MultiSelectProps) {
  const [options, setOptions] = useState<string[]>(defaults);

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
        searchPlaceholderTextColor="gray"
        createable={creatable}
        disabled={disabled}
        reverse
        multi
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'center',
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
