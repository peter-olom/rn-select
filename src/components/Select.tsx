import React, {
  useCallback,
  useMemo,
  useState,
  type ComponentType,
} from 'react';
import SearchBox from './SearchBox';
import { Text, View } from 'react-native';
import useStyles from '../hooks/useStyles';
import SelectRow, { type OptionColors } from './SelectRow';
import BottomSpacer from './BottomSpacer';
import Divider from './Divider';
import Anchor from './Anchor';
import pickBy from 'lodash/pickBy';
import type { IconStyle, Option } from '../types';
import type { TextStyle, ViewStyle } from 'react-native';
import { FlatList } from 'react-native';
import ListContainer from './ListContainer';

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
  optionsScrollIndicator?: boolean;
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
  optionListContainerStyle?: ViewStyle;
  optionListStyle?: ViewStyle;
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
  optionsScrollIndicator = true,
  renderAnchor,
  renderSearch,
  renderOption,
  optionDivider,
  statsTextStyle,
  optionCheckColors,
  ...rest
}: Props) {
  const [showlist, setShowlist] = useState(false);
  const styles = useStyles(
    ({ tokens: { size } }) => ({
      row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        columnGap: 8,
      },
      optionsFlatlist: { paddingHorizontal: size.sm },
      statsRow: { paddingHorizontal: size.sm },
    }),
    []
  );
  const [search, setSearch] = useState('');
  const selected = useMemo(() => new Map(value), [value]);
  const list = useMemo(
    () =>
      options.filter(([_, val]) =>
        val.toLowerCase().includes(search.toLowerCase())
      ),
    [options, search]
  );

  const handleSearch = useCallback(
    (text: string) => {
      setSearch(text);
      onChangeInput?.(text);
    },
    [onChangeInput]
  );
  const handleDismiss = useCallback(() => {
    handleSearch('');
    setShowlist(false);
  }, [handleSearch]);
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
        handleDismiss();
      }
    },
    [handleDismiss, multi, onChangeValue, selected]
  );
  const handleRemove = (key: string) => {
    selected.delete(key);
    onChangeValue?.([...selected]);
  };
  const handleClear = () => onChangeValue?.([]);
  const handleLaunch = () => setShowlist(!showlist);

  const anchorStyleProps = extractStyleProps(rest, 'select', 'Style');
  const searchStyleProps = extractStyleProps(rest, 'search', 'Style');
  const optionStyleProps = extractStyleProps(rest, 'option', 'Style');

  const renderItem = useCallback(
    ({ item: [key, val] }: { item: Option }) => (
      <>
        {!renderOption && (
          <SelectRow
            value={val}
            onPress={() => handleRowPress(key, val)}
            multi={multi}
            checked={selected.has(key)}
            reverse={reverse}
            selectionEffectColor={selectionEffectColor}
            optionCheckColors={optionCheckColors}
            role="option"
            aria-selected={selected.has(key)}
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
    <View role="list">
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
      <ListContainer
        animationType="slide"
        visible={showlist}
        onRequestClose={handleDismiss}
        hardwareAccelerated
        style={[optionStyleProps.optionListContainerStyle]}
      >
        {!renderSearch && (
          <SearchBox
            autoFocus
            onBackPress={handleDismiss}
            placeholder={searchPlaceholder}
            value={search}
            onChangeText={handleSearch}
            role="searchbox"
            {...searchStyleProps}
          />
        )}
        {renderSearch?.({
          search,
          dismiss: handleDismiss,
          onChangeSearch: handleSearch,
        })}
        <View style={[styles.statsRow, styles.row]}>
          {listTitle && <Text style={statsTextStyle}>{listTitle}</Text>}
          <View style={[styles.row]} />
          {showSelectionCount && multi && (
            <Text style={statsTextStyle}>Selections: {selected.size}</Text>
          )}
        </View>
        <FlatList
          data={list}
          keyExtractor={([key]: Option) => key}
          renderItem={renderItem}
          showsVerticalScrollIndicator={optionsScrollIndicator}
          ItemSeparatorComponent={optionDivider ?? Divider}
          keyboardShouldPersistTaps="handled"
          ListFooterComponent={BottomSpacer}
          style={[styles.optionsFlatlist, optionStyleProps.optionListStyle]}
        />
      </ListContainer>
    </View>
  );
}
