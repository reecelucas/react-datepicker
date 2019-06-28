# react-datepicker

An accessible, internationalizable, React datepicker.

## Installation

```Bash
yarn add @reecelucas/react-datepicker
```

## Example Usage

```jsx
// Basic
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

## LICENSE

[MIT](./LICENSE)
