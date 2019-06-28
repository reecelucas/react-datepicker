import * as React from 'react';
import {
  eachDayOfInterval,
  format,
  getDate,
  startOfMonth,
  lastDayOfMonth
} from 'date-fns';
import { StateContext, DispatchContext } from './DatePickerContext';
import * as actionTypes from '../reducer/actionTypes';
import { chunkArray } from '../helpers/array';
import { isFunction } from '../helpers/function';
import {
  dateIsSelectable,
  getDayRemapped,
  getWeekDays,
  isEqualDate
} from '../helpers/date';

type RenderDayContent = (date: Date) => React.ReactNode;
type RenderDayLabel = ({
  date,
  isSelected,
  isSelectable
}: RenderDayLabelParams) => string;

interface RenderDayLabelParams {
  date: Date;
  isSelected: boolean;
  isSelectable: boolean;
}

interface RenderAriaLabelParams {
  date: Date;
  isSelected: boolean;
  isSelectable: boolean;
}

interface Props extends React.HTMLProps<HTMLTableElement> {
  renderDayLabel?: RenderDayLabel;
  renderDayContent?: RenderDayContent;
}

const DatePickerCalendar = ({
  renderDayLabel,
  renderDayContent,
  ...props
}: Props) => {
  const dispatch = React.useContext(DispatchContext);
  const {
    year,
    month,
    selectedDate,
    focussedDate,
    allowCellFocus,
    minDate,
    maxDate,
    excludeDates,
    includeDates,
    locale
  } = React.useContext(StateContext);

  const monthStartDate = startOfMonth(new Date(year, month));
  const monthEndDate = lastDayOfMonth(new Date(year, month));
  const monthDates = eachDayOfInterval({
    start: monthStartDate,
    end: monthEndDate
  });
  const numberOfBlanks = getDayRemapped(new Date(year, month));
  const blanks = Array.from(Array(numberOfBlanks).keys()).map(() => '');
  const cells = [...blanks, ...monthDates];
  const rows = chunkArray(cells, 7);

  const renderWeekdays = () =>
    getWeekDays(locale).map(day => <th key={day}>{day}</th>);

  const renderAriaLabel = ({
    date,
    isSelected,
    isSelectable
  }: RenderAriaLabelParams): string => {
    const status = isSelected
      ? 'Selected. '
      : `${isSelectable ? 'Available. ' : 'Not Available. '}`;

    return isFunction(renderDayLabel)
      ? renderDayLabel({ date, isSelected, isSelectable })
      : `${status}${format(date, 'eeee, do MMMM yyyy', { locale })}.`; // prettier-ignore
  };

  const renderTableRows = () =>
    rows.map((row, rowIndex) => (
      <tr key={rowIndex}>
        {row.map((date, dateIndex) =>
          date ? renderCell(date) : <td key={dateIndex} />
        )}
      </tr>
    ));

  const renderCell = (date: string | Date) => {
    const d = new Date(date);
    const isFocussed = allowCellFocus && isEqualDate(focussedDate, d);
    const isSelected = isEqualDate(selectedDate, d);
    const isSelectable = dateIsSelectable({
      date: d,
      minDate,
      maxDate,
      excludeDates,
      includeDates
    });

    return (
      <td
        key={d.toString()}
        role={'button'}
        aria-label={renderAriaLabel({ date: d, isSelected, isSelectable })}
        aria-disabled={isSelectable ? 'false' : 'true'}
        aria-selected={isSelected ? 'true' : 'false'}
        tabIndex={isSelected || isFocussed ? 0 : -1}
        onClick={() =>
          isSelectable &&
          dispatch({ type: actionTypes.SET_SELECTED_DATE, payload: d })
        }
        ref={ref => {
          if (ref && isFocussed) {
            ref.focus();
          }
        }}
      >
        <span aria-hidden={'true'}>
          {isFunction(renderDayContent) ? renderDayContent(d) : getDate(d)}
        </span>
      </td>
    );
  };

  return (
    <table {...props}>
      <thead>
        <tr>{renderWeekdays()}</tr>
      </thead>
      <tbody>{renderTableRows()}</tbody>
    </table>
  );
};

export default DatePickerCalendar;
