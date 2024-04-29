# React Native Select

React Native Select is a select component for React Native that is compatible with both mobile and web platforms. It is entirely written in TypeScript and comes with features such as being searchable, multiselect, and creatable.

> Why another select component? </br>
> I wanted something approachable, highly customizable and that felt just a wee bit native on all platforms. Those wants led me to create this and soon after share it with the community.


## Demo

| Mobile | Web |
|--------|-----|
| <img src="https://github.com/peter-olom/zero/blob/a6a40a37939ce33ad76a1b68920e20fa02a32662/rn-select/rnsm.gif?raw=true" width="1200" alt="Mobile Demo" /> | ![Web Demo](https://github.com/peter-olom/zero/blob/a6a40a37939ce33ad76a1b68920e20fa02a32662/rn-select/rnsw.gif?raw=true) |


## Installation

```sh
yarn add @devrue/rn-select
```
or
```sh
npm install @devrue/rn-select
```

## Usage

```js
import { Select } from 'rn-select';

export function App() {
  const pets = [
    ['cat', 'Cat'],
    ['dog', 'Dog'],
    ['horse', 'Horse'],
    ['fish', 'Fish'],
  ]
  return <Select options={pets} />
}
```

## Props

### Single Select Props
| Prop           | Description                           | Default |
|----------------|---------------------------------------|---------|
| value          | Currently selected value `string`  | None    |
| onChangeValue  | Callback when value changes. Receives `string`| None    |

### Multi Select Props
| Prop           | Description                           | Default |
|----------------|---------------------------------------|---------|
| multi          | Flag indicating multiselect mode      | `true`  |
| value          | Currently selected values `Array<string>`| None    |
| onChangeValue  | Callback when values change. Receives `Array<string>`| None    |


### Common Props
| Prop                          | Description                                 | Default       |
|-------------------------------|---------------------------------------------|---------------|
| placeholder                   | Placeholder text when no option is selected | None          |
| listTitle                     | Title for the options list                  | None          |
| searchPlaceholder             | Placeholder text for the search input       | None          |
| searchPlaceholderTextColor    | Text color for the search input placeholder | None          |
| showSelectionCount            | Flag to show the count of selected items    | `true`       |
| options                       | Array of options (`Array<[key, value]>`)    | Required      |
| reverse                       | Flag to reverse option and check mark positon| `false`       |
| selectionEffectColor          | Color for selection effect                  | None          |
| optionsScrollIndicator        | Flag to show scroll indicator for options   | `true`        |
| emptyOptionsPlaceholder       | Placeholder text when options is empty      | `true`        |
| emptySearchMsg                | Message when search results are empty       | "No options"  |
| value                         | Currently selected value(s) `string` or `Array<string>`| None|
| clearable                     | Flag to enable clearing of selection        | `true`       |
| disabled                      | Flag to disable the component                | `false`       |
| searchable                    | Flag to enable searching                    | `true`        |
| createable                    | Flag to enable creating new items           | `false`       |
| avoidBottom                   | Avoid options from being hidden by browser window `height` or `position` | None |
| onCreateItem                  | Callback when a new item is created         | None          |
| onChangeInput                 | Callback when input value changes           | None          |
| renderAnchor                  | Custom rendering for anchor component       | None          |
| renderSearch                  | Custom rendering for search component       | None          |
| renderOption                  | Custom rendering for option component       | None          |
| optionDivider                 | Custom component for option divider         | None          |
| selectStyle                   | Styles for the select container             | None          |
| selectPlaceholderTextStyle    | Styles for the placeholder text             | None          |
| selectTextStyle               | Styles for the select text                  | None          |
| selectPillTextStyle           | Styles for the select pill text             | None          |
| selectPillRemoveContainerStyle| Styles for the select pill remove container| None          |
| selectPillRemoveIconStyle     | Styles for the select pill remove icon      | None          |
| selectIconStyle               | Styles for the select icon (close & expand) | None          |
| searchContainerStyle          | Styles for the search container             | None          |
| searchInputStyle              | Styles for the search input                 | None          |
| searchBackIconStyle           | Styles for the search back icon             | None          |
| searchClearIconStyle          | Styles for the search clear icon            | None          |
| statsTextStyle                | Styles for the stats text                   | None          |
| optionListContainerStyle      | Styles for the options list container       | None          |
| optionListStyle               | Styles for the options list                 | None          |
| optionContainerStyle          | Styles for the option container             | None          |
| optionTextStyle               | Styles for the option text                  | None          |
| optionCheckColors             | Colors for option checkmark                 | None          |
| emptyTextStyle                | Styles for the empty text                   | None          |


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
