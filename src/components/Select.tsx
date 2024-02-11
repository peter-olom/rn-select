import React, {
  useRef,
  useCallback,
  useMemo,
  useState,
  type ComponentType,
} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBox from './SearchBox';
import { BottomSheetModal, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Text, View } from 'react-native';
import useStyles from '../hooks/useStyles';
import SelectRow, { type OptionColors } from './SelectRow';
import BottomSpacer from './BottomSpacer';
import Divider from './Divider';
import Anchor from './Anchor';
import pickBy from 'lodash/pickBy';
import type { IconStyle, Option } from '../types';
import type { TextStyle, ViewStyle } from 'react-native';

function extractStyleProps<T extends object>(
  obj: T,
  startPattern: string,
  endPattern: string
) {
  return pickBy(
    obj,
    (_, key) => key.startsWith(startPattern) && key.endsWith(endPattern)
  ) as T;
}

interface RenderAnchorProps {
  launch: () => void;
  remove: (key: string) => void;
  clear: () => void;
}
interface RenderAnchor {
  (props: RenderAnchorProps): JSX.Element;
}

interface RenderSearchProps {
  search: string;
  onChangeSearch: (val: string) => void;
  dismiss: () => void;
}
interface RenderSearch {
  (props: RenderSearchProps): JSX.Element;
}

interface RenderOptionProps {
  optionKey: string;
  optionValue: string;
  isChecked: boolean;
  onPress: () => void;
}
interface RenderOptioon {
  (props: RenderOptionProps): JSX.Element;
}

interface Props {
  placeholder?: string;
  listTitle?: string;
  searchPlaceholder?: string;
  multi?: boolean;
  showSelectionCount?: boolean;
  options: Option[];
  reverse?: boolean;
  selectionEffectColor?: string;
  value?: Option[];
  onChangeInput?: (value: string) => void;
  onChangeValue?: (value: Option[]) => void;
  renderAnchor?: RenderAnchor;
  renderSearch?: RenderSearch;
  renderOption?: RenderOptioon;
  optionDivider?: ComponentType;
  selectStyle?: ViewStyle;
  selectPlaceholderTextStyle?: TextStyle;
  selectTextStyle?: TextStyle;
  selectPillTextStyle?: TextStyle;
  selectPillRemoveContainerStyle?: ViewStyle;
  selectPillRemoveIconStyle?: IconStyle;
  selectIconStyle?: IconStyle;
  searchContainerStyle?: ViewStyle;
  searchInputStyle?: TextStyle;
  searchBackIconStyle?: IconStyle;
  searchClearIconStyle?: IconStyle;
  statsTextStyle?: TextStyle;
  optionContainerStyle?: ViewStyle;
  optionTextStyle?: TextStyle;
  optionCheckColors?: OptionColors;
}

export default function Select({
  options,
  value,
  onChangeValue,
  onChangeInput,
  placeholder,
  searchPlaceholder,
  listTitle,
  showSelectionCount = true,
  multi = false,
  reverse,
  selectionEffectColor,
  renderAnchor,
  renderSearch,
  renderOption,
  optionDivider,
  statsTextStyle,
  optionCheckColors,
  ...rest
}: Props) {
  const styles = useStyles(
    () => ({
      noHandle: { display: 'none' },
      container: {
        flex: 1,
        paddingTop: 16,
        paddingHorizontal: 16,
        gap: 12,
      },
      contentContainer: {},
      row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        columnGap: 8,
      },
    }),
    []
  );
  const [search, setSearch] = useState('');
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const selected = useMemo(() => new Map(value), [value]);
  const list = useMemo(
    () =>
      options.filter(([_, val]) =>
        val.toLowerCase().includes(search.toLowerCase())
      ),
    [options, search]
  );
  const dismiss = () => bottomSheetRef.current?.close();

  const handleSearch = (text: string) => {
    setSearch(text);
    onChangeInput?.(text);
  };

  const handleRowPress = useCallback(
    (key: string, val: string) => {
      if (multi) {
        if (selected.has(key)) {
          selected.delete(key);
          onChangeValue?.([...selected]);
        } else {
          onChangeValue?.([...selected, [key, val]]);
        }
      } else {
        if (selected.has(key)) onChangeValue?.([]);
        else onChangeValue?.([[key, val]]);
        dismiss();
      }
    },
    [multi, onChangeValue, selected]
  );

  const handleDismiss = () => {
    handleSearch('');
  };

  const handleRemove = (key: string) => {
    selected.delete(key);
    onChangeValue?.([...selected]);
  };
  const handleClear = () => onChangeValue?.([]);
  const handleLaunch = () => bottomSheetRef.current?.present();

  const anchorStyleProps = extractStyleProps(rest, 'select', 'Style');
  const searchStyleProps = extractStyleProps(rest, 'search', 'Style');
  const optionStyleProps = extractStyleProps(rest, 'option', 'Style');

  const renderItem = useCallback(
    ({ item: [key, val] }: { item: Option }) => (
      <>
        {!renderOption && (
          <SelectRow
            value={val}
            handlePress={() => handleRowPress(key, val)}
            multi={multi}
            checked={selected.has(key)}
            reverse={reverse}
            selectionEffectColor={selectionEffectColor}
            optionCheckColors={optionCheckColors}
            {...optionStyleProps}
          />
        )}
        {renderOption?.({
          optionKey: key,
          optionValue: val,
          isChecked: selected.has(key),
          onPress: () => handleRowPress(key, val),
        })}
      </>
    ),
    [
      handleRowPress,
      multi,
      optionCheckColors,
      optionStyleProps,
      renderOption,
      reverse,
      selected,
      selectionEffectColor,
    ]
  );

  return (
    <>
      {!renderAnchor && (
        <Anchor
          placeholder={placeholder}
          selected={value ?? []}
          multi={multi}
          onPress={handleLaunch}
          onRemove={handleRemove}
          onClear={handleClear}
          {...anchorStyleProps}
        />
      )}
      {renderAnchor?.({
        launch: handleLaunch,
        remove: handleRemove,
        clear: handleClear,
      })}

      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={['100%']}
        handleStyle={styles.noHandle}
        onDismiss={handleDismiss}
      >
        <SafeAreaView style={[styles.container]}>
          {!renderSearch && (
            <SearchBox
              autoFocus
              onBackPress={dismiss}
              placeholder={searchPlaceholder}
              value={search}
              onChangeText={handleSearch}
              {...searchStyleProps}
            />
          )}
          {renderSearch?.({
            search,
            dismiss,
            onChangeSearch: handleSearch,
          })}
          <View style={[styles.row]}>
            {listTitle && <Text style={statsTextStyle}>{listTitle}</Text>}
            <View style={[styles.row]} />
            {showSelectionCount && multi && (
              <Text style={statsTextStyle}>Selections: {selected.size}</Text>
            )}
          </View>
          <BottomSheetFlatList
            data={list}
            keyExtractor={([key]: Option) => key}
            renderItem={renderItem}
            contentContainerStyle={[styles.contentContainer]}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={optionDivider ?? Divider}
            keyboardShouldPersistTaps="handled"
            ListFooterComponent={BottomSpacer}
          />
        </SafeAreaView>
      </BottomSheetModal>
    </>
  );
}
