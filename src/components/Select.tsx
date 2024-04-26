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
import type { AnchorPos, IconStyle, LayoutRect, Option } from '../types';
import type { TextStyle, ViewStyle } from 'react-native';
import { FlatList } from 'react-native';
import ListContainer from './ListContainer';
import EmptyList from './EmptyList';
import { Platform } from 'react-native';
import { MIN_WIDTH } from './common';

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
  setRect: (pos: LayoutRect) => void;
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
interface RenderOption {
  (props: RenderOptionProps): JSX.Element;
}

export interface CommonProps {
  placeholder?: string;
  listTitle?: string;
  searchPlaceholder?: string;
  searchPlaceholderTextColor?: string;
  showSelectionCount?: boolean;
  options: Option[];
  reverse?: boolean;
  selectionEffectColor?: string;
  optionsScrollIndicator?: boolean;
  emptySearchMsg?: string;
  value?: string | string[];
  clearable?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  createable?: boolean;
  onCreateItem?: (value: string) => void;
  onChangeInput?: (value: string) => void;
  renderAnchor?: RenderAnchor;
  renderSearch?: RenderSearch;
  renderOption?: RenderOption;
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
  onCreateItem,
  placeholder,
  searchPlaceholder,
  searchPlaceholderTextColor,
  listTitle,
  showSelectionCount = true,
  reverse,
  selectionEffectColor,
  optionsScrollIndicator = true,
  emptySearchMsg,
  clearable = true,
  disabled,
  searchable = true,
  createable,
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
  const [search, setSearch] = useState('');
  const [anchorPosition, setAnchorPosition] = useState<AnchorPos>({});
  const [createdOptions, setCreatedOptions] = useState<Option[]>([]);

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
      optionListContainer: Platform.select({
        web: {
          minWidth: MIN_WIDTH,
          ...((anchorPosition.width ?? 0) >= MIN_WIDTH && {
            width: anchorPosition.width,
          }),
        },
        default: {},
      }),
    }),
    [anchorPosition]
  );

  const [selectedMap, selectedOptions] = useMemo(() => {
    const optionsMap = new Map([...options, ...createdOptions]);
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
  }, [createdOptions, options, value]);

  const list = useMemo(
    () =>
      [...options, ...createdOptions].filter(([_, val]) =>
        val.toLowerCase().includes(search.toLowerCase())
      ),
    [createdOptions, options, search]
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
  const handleRemove = useCallback(
    (key: string) => {
      selectedMap.delete(key);
      if ('multi' in rest) rest.onChangeValue?.([...selectedMap.keys()]);
    },
    [rest, selectedMap]
  );
  const handleClear = useCallback(() => {
    if ('multi' in rest) rest.onChangeValue?.([]);
    else rest.onChangeValue?.('');
  }, [rest]);
  const handleLaunch = useCallback(() => setShowlist(!showlist), [showlist]);

  const handleLayout = useCallback((rect: LayoutRect) => {
    const { top, left, width } = rect;
    setAnchorPosition({ x: left ?? 0, y: top ?? 0, width });
  }, []);

  const handleCreateItem = useCallback(
    (createValue: string) => {
      onCreateItem?.(createValue);
      setCreatedOptions((c) => [...c, [createValue, createValue]]);
      handleRowPress(createValue);
    },
    [handleRowPress, onCreateItem]
  );

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

  const customAnchor = useMemo(
    () =>
      renderAnchor?.({
        launch: handleLaunch,
        remove: handleRemove,
        clear: handleClear,
        setRect: handleLayout,
      }),
    [handleClear, handleLaunch, handleLayout, handleRemove, renderAnchor]
  );

  return (
    <View role="list">
      {!renderAnchor && (
        <Anchor
          placeholder={placeholder}
          selected={selectedOptions ?? []}
          multi={multi}
          onPress={disabled ? null : handleLaunch}
          onRemove={handleRemove}
          onClear={handleClear}
          onLayout={handleLayout}
          disabled={disabled}
          clearable={clearable}
          {...anchorStyleProps}
        />
      )}
      {customAnchor}

      <ListContainer
        visible={showlist}
        onRequestClose={handleDismiss}
        hardwareAccelerated
        style={[
          styles.optionListContainer,
          optionStyleProps.optionListContainerStyle,
        ]}
        {...Platform.select({
          web: {
            animationType: 'fade',
            transparent: true,
            position: anchorPosition,
          },
          default: { animationType: 'slide' },
        })}
      >
        {searchable && (
          <>
            {!renderSearch && (
              <SearchBox
                autoFocus
                onBackPress={handleDismiss}
                placeholder={searchPlaceholder}
                value={search}
                onChangeText={handleSearch}
                role="searchbox"
                placeholderTextColor={searchPlaceholderTextColor}
                {...searchStyleProps}
              />
            )}
            {renderSearch?.({
              search,
              dismiss: handleDismiss,
              onChangeSearch: handleSearch,
            })}
          </>
        )}
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
              createOption={createable ? search : undefined}
              onCreate={handleCreateItem}
            />
          }
          style={[styles.optionsFlatlist, optionStyleProps.optionListStyle]}
          contentContainerStyle={styles.optionsFlatlistContent}
        />
      </ListContainer>
    </View>
  );
}
