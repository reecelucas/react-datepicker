import * as React from 'react';
import styled from '@emotion/styled';
import { storiesOf } from '@storybook/react';
import { addDays, addYears, format, getDate, isWeekend } from 'date-fns';
import locale from 'date-fns/locale/fr'; // tslint:disable-line:no-submodule-imports
import {
  DatePicker,
  DatePickerCalendar,
  DatePickerMonth,
  DatePickerButton,
  DatePickerTable,
  DatePickerInput
} from '../index';

const StyledDatePicker = styled(DatePicker)`
  border: 2px solid black;
  display: inline-block;
  padding: 12px;

  td[role='button'] {
    cursor: pointer;
  }

  [aria-disabled='true'] {
    opacity: 0.5;
    pointer-events: none;
  }

  [aria-selected='true'] {
    background-color: blue;
    color: white;
  }
`;

const movePrevMonth = ({ prev }) => prev();
const moveNextMonth = ({ next }) => next();

const now = new Date(Date.now());
const initialDate = addYears(now, 1);
const minDate = addDays(now, 7);
const maxDate = addDays(minDate, 14);
const excludeDates = [now, addDays(now, 1), addDays(now, 2)];
const includeDates = [now, addDays(now, 1), addDays(now, 2)];

const renderFrenchLabel = ({ date, isSelected, isSelectable }) => {
  const status = isSelected
    ? 'Sélectionné. '
    : `${isSelectable ? 'Disponible. ' : 'Indisponible. '}`;

  return `${status}${format(date, 'eeee, do MMMM yyyy', { locale })}.`;
};

const renderWeekendDate = date => (
  <span style={{ background: isWeekend(date) ? 'pink' : 'transparent' }}>
    {getDate(date)}
  </span>
);

const renderScreenReaderMsg = () => (
  <p>
    I'm a custom screen reader message. I should describe how to interact with
    the date picker, playing special attention to the keyboard shortcuts that
    are available.
  </p>
);

storiesOf('DatePicker', module)
  .add('Basic', () => (
    <StyledDatePicker onSelect={date => console.log(date)}>
      <DatePickerInput />
      <br />
      <DatePickerCalendar>
        <DatePickerMonth />
        <br />
        <DatePickerButton updateMonth={movePrevMonth}>Prev</DatePickerButton>
        <DatePickerButton updateMonth={moveNextMonth}>Next</DatePickerButton>
        <DatePickerTable />
      </DatePickerCalendar>
    </StyledDatePicker>
  ))
  .add('initialDate', () => (
    <StyledDatePicker
      initialDate={initialDate}
      onSelect={date => console.log(date)}
    >
      <DatePickerInput />
      <br />
      <DatePickerCalendar>
        <DatePickerMonth />
        <br />
        <DatePickerButton updateMonth={movePrevMonth}>Prev</DatePickerButton>
        <DatePickerButton updateMonth={moveNextMonth}>Next</DatePickerButton>
        <DatePickerTable />
      </DatePickerCalendar>
    </StyledDatePicker>
  ))
  .add('minDate', () => (
    <StyledDatePicker minDate={minDate} onSelect={date => console.log(date)}>
      <DatePickerInput />
      <br />
      <DatePickerCalendar>
        <DatePickerMonth />
        <br />
        <DatePickerButton updateMonth={movePrevMonth}>Prev</DatePickerButton>
        <DatePickerButton updateMonth={moveNextMonth}>Next</DatePickerButton>
        <DatePickerTable />
      </DatePickerCalendar>
    </StyledDatePicker>
  ))
  .add('maxDate', () => (
    <StyledDatePicker maxDate={maxDate} onSelect={date => console.log(date)}>
      <DatePickerInput />
      <br />
      <DatePickerCalendar>
        <DatePickerMonth />
        <br />
        <DatePickerButton updateMonth={movePrevMonth}>Prev</DatePickerButton>
        <DatePickerButton updateMonth={moveNextMonth}>Next</DatePickerButton>
        <DatePickerTable />
      </DatePickerCalendar>
    </StyledDatePicker>
  ))
  .add('minDate + maxDate', () => (
    <StyledDatePicker
      minDate={minDate}
      maxDate={maxDate}
      onSelect={date => console.log(date)}
    >
      <DatePickerInput />
      <br />
      <DatePickerCalendar>
        <DatePickerMonth />
        <br />
        <DatePickerButton updateMonth={movePrevMonth}>Prev</DatePickerButton>
        <DatePickerButton updateMonth={moveNextMonth}>Next</DatePickerButton>
        <DatePickerTable />
      </DatePickerCalendar>
    </StyledDatePicker>
  ))
  .add('excludeDates', () => (
    <StyledDatePicker
      excludeDates={excludeDates}
      onSelect={date => console.log(date)}
    >
      <DatePickerInput />
      <br />
      <DatePickerCalendar>
        <DatePickerMonth />
        <br />
        <DatePickerButton updateMonth={movePrevMonth}>Prev</DatePickerButton>
        <DatePickerButton updateMonth={moveNextMonth}>Next</DatePickerButton>
        <DatePickerTable />
      </DatePickerCalendar>
    </StyledDatePicker>
  ))
  .add('includeDates', () => (
    <StyledDatePicker
      includeDates={includeDates}
      onSelect={date => console.log(date)}
    >
      <DatePickerInput />
      <br />
      <DatePickerCalendar>
        <DatePickerMonth />
        <br />
        <DatePickerButton updateMonth={movePrevMonth}>Prev</DatePickerButton>
        <DatePickerButton updateMonth={moveNextMonth}>Next</DatePickerButton>
        <DatePickerTable />
      </DatePickerCalendar>
    </StyledDatePicker>
  ))
  .add('locale + renderDayLabel', () => (
    <StyledDatePicker locale={locale} onSelect={date => console.log(date)}>
      <DatePickerInput />
      <br />
      <DatePickerCalendar>
        <DatePickerMonth />
        <br />
        <DatePickerButton updateMonth={movePrevMonth}>Prev</DatePickerButton>
        <DatePickerButton updateMonth={moveNextMonth}>Next</DatePickerButton>
        <DatePickerTable renderDayLabel={renderFrenchLabel} />
      </DatePickerCalendar>
    </StyledDatePicker>
  ))
  .add('onKeydown handler', () => (
    <StyledDatePicker
      onSelect={date => console.log(date)}
      onKeyDown={event => {
        console.log('DatePicker, target = ', event.target);
      }}
    >
      <DatePickerInput />
      <br />
      <DatePickerCalendar>
        <DatePickerMonth />
        <br />
        <DatePickerButton updateMonth={movePrevMonth}>Prev</DatePickerButton>
        <DatePickerButton updateMonth={moveNextMonth}>Next</DatePickerButton>
        <DatePickerTable renderDayLabel={renderFrenchLabel} />
      </DatePickerCalendar>
    </StyledDatePicker>
  ))
  .add('dateFormat: DatePickerMonth', () => (
    <StyledDatePicker onSelect={date => console.log(date)}>
      <DatePickerInput />
      <br />
      <DatePickerCalendar>
        <DatePickerMonth dateFormat={'MMM, yyyy'} />
        <br />
        <DatePickerButton updateMonth={movePrevMonth}>Prev</DatePickerButton>
        <DatePickerButton updateMonth={moveNextMonth}>Next</DatePickerButton>
        <DatePickerTable />
      </DatePickerCalendar>
    </StyledDatePicker>
  ))
  .add('onClick handler: DatePickerButton', () => (
    <StyledDatePicker onSelect={date => console.log(date)}>
      <DatePickerInput />
      <br />
      <DatePickerCalendar>
        <DatePickerMonth />
        <br />
        <DatePickerButton
          updateMonth={movePrevMonth}
          onClick={event => {
            console.log('DatePickerButton (prev), target = ', event.target);
          }}
        >
          Prev
        </DatePickerButton>
        <DatePickerButton
          updateMonth={moveNextMonth}
          onClick={event => {
            console.log('DatePickerButton (next), target = ', event.target);
          }}
        >
          Next
        </DatePickerButton>
        <DatePickerTable />
      </DatePickerCalendar>
    </StyledDatePicker>
  ))
  .add('renderDayContent', () => (
    <StyledDatePicker onSelect={date => console.log(date)}>
      <DatePickerInput />
      <br />
      <DatePickerCalendar>
        <DatePickerMonth dateFormat={'MMM, yyyy'} />
        <br />
        <DatePickerButton updateMonth={movePrevMonth}>Prev</DatePickerButton>
        <DatePickerButton updateMonth={moveNextMonth}>Next</DatePickerButton>
        <DatePickerTable renderDayContent={renderWeekendDate} />
      </DatePickerCalendar>
    </StyledDatePicker>
  ))
  .add('dateFormat: DatePickerInput', () => (
    <StyledDatePicker onSelect={date => console.log(date)}>
      <DatePickerInput dateFormat={'MM/dd/yyyy'} />
      <br />
      <DatePickerCalendar>
        <DatePickerMonth />
        <br />
        <DatePickerButton updateMonth={movePrevMonth}>Prev</DatePickerButton>
        <DatePickerButton updateMonth={moveNextMonth}>Next</DatePickerButton>
        <DatePickerTable />
      </DatePickerCalendar>
    </StyledDatePicker>
  ))
  .add('placeholder: DatePickerInput', () => (
    <StyledDatePicker onSelect={date => console.log(date)}>
      <DatePickerInput placeholder={'Pick a date'} />
      <br />
      <DatePickerCalendar>
        <DatePickerMonth />
        <br />
        <DatePickerButton updateMonth={movePrevMonth}>Prev</DatePickerButton>
        <DatePickerButton updateMonth={moveNextMonth}>Next</DatePickerButton>
        <DatePickerTable />
      </DatePickerCalendar>
    </StyledDatePicker>
  ))
  .add('screenReaderMessage function', () => (
    <StyledDatePicker onSelect={date => console.log(date)}>
      <DatePickerInput screenReaderMessage={renderScreenReaderMsg} />
      <br />
      <DatePickerCalendar>
        <DatePickerMonth />
        <br />
        <DatePickerButton updateMonth={movePrevMonth}>Prev</DatePickerButton>
        <DatePickerButton updateMonth={moveNextMonth}>Next</DatePickerButton>
        <DatePickerTable />
      </DatePickerCalendar>
    </StyledDatePicker>
  ))
  .add('screenReaderMessage element', () => (
    <StyledDatePicker onSelect={date => console.log(date)}>
      <DatePickerInput
        screenReaderMessage={
          <p>
            I'm a custom screen reader message. I should describe how to
            interact with the date picker, playing special attention to the
            keyboard shortcuts that are available.
          </p>
        }
      />
      <br />
      <DatePickerCalendar>
        <DatePickerMonth />
        <br />
        <DatePickerButton updateMonth={movePrevMonth}>Prev</DatePickerButton>
        <DatePickerButton updateMonth={moveNextMonth}>Next</DatePickerButton>
        <DatePickerTable />
      </DatePickerCalendar>
    </StyledDatePicker>
  ))
  .add('Spread props', () => (
    <StyledDatePicker onSelect={date => console.log(date)} data-dp={true}>
      <DatePickerInput data-dp-input={true} />
      <br />
      <DatePickerCalendar>
        <DatePickerMonth data-dp-month={true} />
        <br />
        <DatePickerButton updateMonth={movePrevMonth} data-dp-prev-btn={true}>
          Prev
        </DatePickerButton>
        <DatePickerButton updateMonth={moveNextMonth} data-dp-next-btn={true}>
          Next
        </DatePickerButton>
        <DatePickerTable data-dp-table={true} />
      </DatePickerCalendar>
    </StyledDatePicker>
  ));
