import React from 'react';
import { Text, View, type TextStyle } from 'react-native';
import useStyles from '../hooks/useStyles';

interface Props {
  msg?: string;
  textStyle?: TextStyle;
}
export default function EmptyList({ msg, textStyle }: Props) {
  const styles = useStyles(
    ({ tokens: { size } }) => ({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 300,
      },
      text: {
        fontSize: size.lg,
        fontStyle: 'italic',
        color: '#808080',
        textAlign: 'center',
      },
    }),
    []
  );
  return (
    <View style={[styles.container]}>
      <Text style={[styles.text, textStyle]}>
        {msg ?? '"No option matched your query"'}
      </Text>
    </View>
  );
}
