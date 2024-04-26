import React from 'react';
import { Text, View, type TextStyle } from 'react-native';
import useStyles from '../hooks/useStyles';
import { Pressable } from 'react-native';

interface Props {
  msg?: string;
  textStyle?: TextStyle;
  createOption?: string;
  onCreate?: (value: string) => void;
}
export default function EmptyList({
  msg,
  textStyle,
  createOption,
  onCreate,
}: Props) {
  const styles = useStyles(
    ({ tokens: { size } }) => ({
      container: {
        flex: 1,
        justifyContent: !createOption ? 'center' : undefined,
        alignItems: 'center',
      },
      text: {
        fontSize: size.md,
        fontStyle: 'italic',
        color: '#808080',
        textAlign: 'center',
        paddingVertical: size.lg,
      },
      create: {
        padding: size.sm,
        backgroundColor: '#f9f9f9',
        width: '100%',
      },
    }),
    []
  );
  return (
    <View style={[styles.container]}>
      {!createOption && (
        <Text style={[styles.text, textStyle]}>
          {msg ?? '"No option matched your search"'}
        </Text>
      )}
      {createOption && (
        <Pressable
          style={styles.create}
          onPress={() => onCreate?.(createOption)}
        >
          <Text>Create "{createOption}"</Text>
        </Pressable>
      )}
    </View>
  );
}
