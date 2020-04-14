import * as React from 'react';
import { StateContext } from './DatePickerContext';

interface Props extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
}

const DatePickerCalendar = ({ children, ...props }: Props) => {
  const { showCalendar, calendarRef } = React.useContext(StateContext);

  return showCalendar ? (
    <div ref={calendarRef} {...props} role='dialog'>
      {children}
    </div>
  ) : null;
};

export default DatePickerCalendar;
