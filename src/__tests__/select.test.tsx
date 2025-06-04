import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';

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

const OPTIONS = [
  ['1', 'One'],
  ['2', 'Two'],
];

describe('Select', () => {
  it('opens option list and selects a value', async () => {
    const onChangeValue = jest.fn();
    const { getByText, queryByText, getByRole } = render(
      <Select
        options={OPTIONS}
        onChangeValue={onChangeValue}
        placeholder="Pick"
      />
    );

    expect(queryByText('One')).toBeNull();

    await act(async () => {
      fireEvent.press(getByText('Pick'));
    });

    await waitFor(() => {
      expect(getByRole('searchbox')).toBeTruthy();
    });

    fireEvent.press(getByText('One'));

    expect(onChangeValue).toHaveBeenCalledWith('1');
  });
});
