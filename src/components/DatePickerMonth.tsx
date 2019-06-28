import * as React from 'react';
import { format } from 'date-fns';
import { StateContext } from './DatePickerContext';
import { isFunction } from '../helpers/function';

interface Props {
  children?: (formattedDate: string) => JSX.Element;
  dateFormat?: string; // Valid date-fns format string
}

const DatePickerMonth = ({
  children,
  dateFormat = 'MMMM, yyyy',
  ...props
}: Props) => {
  const { year, month, locale } = React.useContext(StateContext);
  const formattedDate = format(new Date(year, month), dateFormat, { locale });

  const renderDefault = () => <span {...props}>{formattedDate}</span>;
  const render = () =>
    isFunction(children) ? children(formattedDate) : renderDefault();

  // Only re-render if the context values or props have changed...
  return React.useMemo(render, [
    year,
    month,
    locale,
    children,
    dateFormat,
    ...Object.keys(props)
  ]);
};

export default DatePickerMonth;
