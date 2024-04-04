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
import EmptyList from './EmptyList';

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

export interface CommonProps {
  placeholder?: string;
  listTitle?: string;
  searchPlaceholder?: string;
  showSelectionCount?: boolean;
  options: Option[];
  reverse?: boolean;
  selectionEffectColor?: string;
  optionsScrollIndicator?: boolean;
  emptySearchMsg?: string;
  value?: string | string[];
  onChangeInput?: (value: string) => void;
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
  emptyTextStyle?: TextStyle;
}

export interface SingleSelectProps extends CommonProps {
  value?: string;
  onChangeValue?: (value: string) => void;
}

export interface MultiSelectProps extends CommonProps {
  multi: true;
  value?: string[];
  onChangeValue?: (value: string[]) => void;
}

export type Props = SingleSelectProps | MultiSelectProps;

export default function Select({
  options,
  value,
  onChangeInput,
  placeholder,
  searchPlaceholder,
  listTitle,
  showSelectionCount = true,
  reverse,
  selectionEffectColor,
  optionsScrollIndicator = true,
  emptySearchMsg,
  renderAnchor,
  renderSearch,
  renderOption,
  optionDivider,
  statsTextStyle,
  optionCheckColors,
  emptyTextStyle,
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
      optionsFlatlist: {
        flex: 1,
        paddingHorizontal: size.sm,
      },
      optionsFlatlistContent: { flexGrow: 1 },
      statsRow: { paddingHorizontal: size.sm },
    }),
    []
  );
  const [search, setSearch] = useState('');

  const [selectedMap, selectedOptions] = useMemo(() => {
    const optionsMap = new Map(options);
    const foundOptions = [] as Option[];
    if (value) {
      if (Array.isArray(value)) {
        const foundValues = value
          .map((item) => {
            return [item, optionsMap.get(item)] as Option;
          })
          .filter((item) => item[1]);
        foundOptions.push(...foundValues);
      } else {
        const item = optionsMap.get(value);
        if (item) foundOptions.push([value, item]);
      }
    }
    return [new Map(foundOptions), foundOptions] as const;
  }, [options, value]);

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
    (key: string) => {
      if ('multi' in rest) {
        if (selectedMap.has(key)) {
          selectedMap.delete(key);
          rest.onChangeValue?.([...selectedMap.keys()]);
        } else {
          rest.onChangeValue?.([...selectedMap.keys(), key]);
        }
      } else {
        if (selectedMap.has(key)) rest.onChangeValue?.('');
        else rest.onChangeValue?.(key);
        handleDismiss();
      }
    },
    [handleDismiss, rest, selectedMap]
  );
  const handleRemove = (key: string) => {
    selectedMap.delete(key);
    if ('multi' in rest) rest.onChangeValue?.([...selectedMap.keys()]);
  };
  const handleClear = () => {
    if ('multi' in rest) rest.onChangeValue?.([]);
    else rest.onChangeValue?.('');
  };
  const handleLaunch = () => setShowlist(!showlist);

  const anchorStyleProps = extractStyleProps(rest, 'select', 'Style');
  const searchStyleProps = extractStyleProps(rest, 'search', 'Style');
  const optionStyleProps = extractStyleProps(rest, 'option', 'Style');
  const noOptions = options.length === 0 ? 'No Options' : undefined;

  const multi = useMemo(() => ('multi' in rest ? true : false), [rest]);

  const renderItem = useCallback(
    ({ item: [key, val] }: { item: Option }) => (
      <>
        {!renderOption && (
          <SelectRow
            value={val}
            onPress={() => handleRowPress(key)}
            multi={multi}
            checked={selectedMap.has(key)}
            reverse={reverse}
            selectionEffectColor={selectionEffectColor}
            optionCheckColors={optionCheckColors}
            role="option"
            aria-selected={selectedMap.has(key)}
            {...optionStyleProps}
          />
        )}
        {renderOption?.({
          optionKey: key,
          optionValue: val,
          isChecked: selectedMap.has(key),
          onPress: () => handleRowPress(key),
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
      selectedMap,
      selectionEffectColor,
    ]
  );

  console.log('@@@', { selectedMap, selectedOptions });

  return (
    <View role="list">
      {!renderAnchor && (
        <Anchor
          placeholder={placeholder}
          selected={selectedOptions ?? []}
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
            <Text style={statsTextStyle}>Selections: {selectedMap.size}</Text>
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
          ListEmptyComponent={
            <EmptyList
              textStyle={emptyTextStyle}
              msg={noOptions ?? emptySearchMsg}
            />
          }
          style={[styles.optionsFlatlist, optionStyleProps.optionListStyle]}
          contentContainerStyle={styles.optionsFlatlistContent}
        />
      </ListContainer>
    </View>
  );
}
