# react-datepicker

An accessible, internationalizable React datepicker. [Demo](https://codesandbox.io/s/angry-water-z01z2?fontsize=14&hidenavigation=1).

![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@reecelucas/react-datepicker.svg)
![npm (scoped)](https://img.shields.io/npm/v/@reecelucas/react-datepicker.svg)
![GitHub](https://img.shields.io/github/license/reecelucas/react-datepicker.svg)

* [Installation](#installation)
* [Example Usage](#example-usage)
  * [Basic](#basic)
  * [Initial Date](#initial-date)
  * [Min Date](#min-date)
  * [Max Date](#max-date)
  * [Date Range](#date-range)
  * [Exclude Dates](#exclude-dates)
  * [Include Dates](#include-dates)
  * [Locale](#non-english-locale)
  * [Month Format](#month-format)
  * [Render Day Content](#render-day-content)
  * [Input Date Format](#input-date-format)
  * [Screen Reader Message](#screen-reader-message)
* [Props](#props)
  * [`DatePicker`](#DatePicker)
  * [`DatePickerInput`](#DatePickerInput)
  * [`DatePickerCalendar`](#DatePickerCalendar)
  * [`DatePickerMonth`](#DatePickerMonth)
  * [`DatePickerButton`](#DatePickerButton)
  * [`DatePickeTable`](#DatePickeTable)
* [Styling](#styling)
* [LICENSE](#LICENSE)

## Installation

```Bash
yarn add @reecelucas/react-datepicker
```

## Example Usage

### Basic

```jsx
<DatePicker onSelect={date => console.log(date)}>
  <DatePickerInput />

  <DatePickerCalendar>
    <DatePickerMonth />
    <DatePickerButton updateMonth={({ prev }) => prev()}>
      Prev Month
    </DatePickerButton>
    <DatePickerButton updateMonth={({ next }) => next()}>
      Next Month
    </DatePickerButton>
    <DatePickerTable />
  </DatePickerCalendar>
</DatePicker>
```

### Initial Date

```jsx
<DatePicker
  initialDate={new Date(2020, 10, 10)}
  onSelect={date => console.log(date)}
>
  {/* ... */}
</DatePicker>
```

### Min Date

```jsx
<DatePicker
  minDate={new Date(2020, 0, 1)}
  onSelect={date => console.log(date)}
>
  {/* ... */}
</DatePicker>
```

### Max Date

```jsx
<DatePicker
  maxDate={new Date(2020, 0, 1)}
  onSelect={date => console.log(date)}
>
  {/* ... */}
</DatePicker>
```

### Date Range

```jsx
<DatePicker
  minDate={new Date(Date.now())}
  maxDate={new Date(2020, 0, 1)}
  onSelect={date => console.log(date)}
>
  {/* ... */}
</DatePicker>
```

### Exclude Dates

```jsx
<DatePicker
  excludeDates={[new Date(2019, 6, 1), new Date(2019, 6, 2)]}
  onSelect={date => console.log(date)}
>
  {/* ... */}
</DatePicker>
```

### Include Dates

```jsx
<DatePicker
  includeDates={[new Date(2019, 6, 1), new Date(2019, 6, 2)]}
  onSelect={date => console.log(date)}
>
  {/* ... */}
</DatePicker>
```

### Non-English Locale

Import the required date-fns [`locale`](https://date-fns.org/v2.0.0-alpha.37/docs/I18n#supported-languages)
and make sure to render a custom aria label for each day, using the `renderDayLabel` prop.

```jsx
import { format } from 'date-fns';
import locale from 'date-fns/locale/fr';

<DatePicker
  locale={locale}
  onSelect={date => console.log(date)}
>
  {/* ... */}
  <DatePickerCalendar>
    {/* ... */}
    <DatePickerTable
      renderDayLabel={({ date, isSelected, isSelectable }) => {
        const status = isSelected ? 'Sélectionné. ' : `${isSelectable ? 'Disponible. ' : 'Indisponible. '}`;
        return `${status}${format(date, 'eeee, do MMMM yyyy', { locale })}.`;
      }}
    />
  </DatePickerCalendar>
</DatePicker>
```

### Custom Month Format

Pass a valid date-fns [`format`](https://date-fns.org/v2.0.0-alpha.37/docs/format) string.

```jsx
<DatePicker onSelect={date => console.log(date)}>
  <DatePickerInput />

  <DatePickerCalendar>
    <DatePickerMonth dateFormat={'MMM, yyyy'} />
    {/* ... */}
  </DatePickerCalendar>
</DatePicker>
```

### Render Day Content

```jsx
import { getDate, isWeekend } from 'date-fns';

<DatePicker onSelect={date => console.log(date)}>
  {/* ... */}
  <DatePickerCalendar>
    {/* ... */}
    <DatePickerTable
      renderDayContent={date => (
        <span style={{ background: isWeekend(date) ? 'pink' : 'transparent' }}>
          {getDate(date)}
        </span>
      )}
    />
  </DatePickerCalendar>
</DatePicker>
```

### Custom Input Date Format

Pass a valid date-fns [`format`](https://date-fns.org/v2.0.0-alpha.37/docs/format) string.

```jsx
<DatePicker onSelect={date => console.log(date)}>
  <DatePickerInput dateFormat={'MM/dd/yyyy'} />
  {/* ... */}
</DatePicker>
```

### Custom Screen Reader Message

The `DatePickerInput` includes an `aria-describedby` attribute that references
a visually hidden aria message (for use by screen readers). The default message is:

```jsx
<>
  <p>
    Press the down arrow key to interact with the calendar and select a date.
    The following keyboard shortcuts can be used to change dates.
  </p>
  <ul>
    <li>Enter Key: select the date in focus.</li>
    <li>
      Right and left arrow keys: Move backward (left) and forward (right) by
      one day.
    </li>
    <li>
      Up and down arrow keys: Move backward (up) and forward (down) by one
      week.
    </li>
    <li>Page up and page down keys: Switch months.</li>
    <li>Home and end keys: go to the first or last day of a week.</li>
    <li>Escape key: Return to the date input field.</li>
  </ul>
</>
```

But you can render a custom message (E.g. written in another language if you're
passing a [`locale`](#non-english-locale)) by passing a render function...

```jsx
const renderScreenReaderMsg = () => (
  <p>
    I'm a custom screen reader message. I should describe how to interact with
    the date picker, playing special attention to the keyboard shortcuts that
    are available. This message won't be visible in the UI.
  </p>
);

<DatePicker onSelect={date => console.log(date)}>
  <DatePickerInput screenReaderMessage={renderScreenReaderMsg} />
  {/* ... */}
</DatePicker>
```

...Or by passing a JSX element

```jsx
<DatePicker onSelect={date => console.log(date)}>
  <DatePickerInput
    screenReaderMessage={
      <p>
        I'm a custom screen reader message. I should describe how to interact with
        the date picker, playing special attention to the keyboard shortcuts that
        are available. This message won't be visible in the UI.
      </p>
    }
  />
  {/* ... */}
</DatePicker>
```

## Props

### `DatePicker`

```js
children: React.ReactNode;
onSelect: (selectedDate: Date) => void;
initialDate?: Date; // Defaults to new Date(Date.now())
minDate?: Date;
maxDate?: Date;
excludeDates?: Date[];
includeDates?: Date[];
locale?: Locale; // date-fns `locale` object
```

> Any props not listed above will be spread onto the underlying `DatePicker` element.

### `DatePickerInput`

```ts
dateFormat?: string; // date-fns `format` string
screenReaderMessage?: JSX.Element | () => JSX.Element;
```

> Any props not listed above will be spread onto the underlying `DatePickerInput` element.

### `DatePickerCalendar`

```ts
children: React.ReactNode;
```

> Any props not listed above will be spread onto the underlying `DatePickerCalendar` element.

### `DatePickerMonth`

```ts
children?: (formattedDate: string) => JSX.Element;
dateFormat?: string; // date-fns `format` string
```

> Any props not listed above will be spread onto the underlying `DatePickerMonth` element.

### `DatePickerButton`

```ts
interface UpdateMonthParams {
  prev: () => void;
  next: () => void;
}

children: React.ReactNode;
updateMonth: ({ prev, next }: UpdateMonthParams) => void;
```

> Any props not listed above will be spread onto the underlying `DatePickerButton` element.

### `DatePickerTable`

```ts
interface RenderDayLabelParams {
  date: Date;
  isSelected: boolean;
  isSelectable: boolean;
}

renderDayLabel?: ({ date, isSelected, isSelectable }: RenderDayLabelParams) => string;
renderDayContent?: (date: Date) => React.ReactNode;
```

> Any props not listed above will be spread onto the underlying `DatePickerTable` element.

## Styling

`react-datepicker` doesn't provide any default styling; you're free to do what you want and use what you want.

```jsx
// Example using CSS Modules
import * as styles from './styles';

<DatePicker
  className={styles.wrapper}
  onSelect={date => console.log(date)}
>
  <DatePickerInput className={styles.input} />

  <DatePickerCalendar>
    <DatePickerMonth className={styles.selectedMonth} />
    <DatePickerButton
      className={styles.button}
      updateMonth={({ prev }) => prev()}
    >
      Prev Month
    </DatePickerButton>
    <DatePickerButton
      className={styles.button}
      updateMonth={({ next }) => next()}
    >
      Next Month
    </DatePickerButton>
    <DatePickerTable className={styles.table} />
  </DatePickerCalendar>
</DatePicker>
```

## LICENSE

[MIT](./LICENSE)
