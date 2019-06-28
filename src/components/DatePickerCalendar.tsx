import * as React from 'react';
import { StateContext } from './DatePickerContext';

interface Props {
  children: React.ReactNode;
}

const DatePickerCalendar = ({ children }: Props) => {
  const { showCalendar } = React.useContext(StateContext);
  return showCalendar ? <>{children}</> : null;
};

export default DatePickerCalendar;
