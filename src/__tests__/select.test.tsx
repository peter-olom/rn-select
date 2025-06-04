import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

jest.mock('react-native/Libraries/Modal/Modal', () => {
  const React = require('react');
  return ({ visible, children }: any) => (visible ? <>{children}</> : null);
});
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  return {
    SafeAreaProvider: ({ children }: any) => <>{children}</>,
    SafeAreaView: ({ children }: any) => <>{children}</>,
  };
});
import { Select } from '../index';
import type { Option } from '../types';

const OPTIONS: Option[] = [
  ['1', 'One'],
  ['2', 'Two'],
];

describe('Select', () => {
  it('opens option list and selects a value', () => {
    const onChangeValue = jest.fn();
    const { getByText, queryByText } = render(
      <Select
        options={OPTIONS}
        onChangeValue={onChangeValue}
        placeholder="Pick"
      />
    );

    expect(queryByText('One')).toBeNull();

    fireEvent.press(getByText('Pick'));

    expect(getByText('One')).toBeTruthy();

    fireEvent.press(getByText('One'));

    expect(onChangeValue).toHaveBeenCalledWith('1');
  });
});
