import * as React from 'react';
import { format, isValid, parse } from 'date-fns';
import { StateContext, DispatchContext } from './DatePickerContext';
import * as actionTypes from '../reducer/actionTypes';
import DatePickerDescription from './DatePickerDescription';
import { isEqualDate } from '../helpers/date';
import { isFunction } from '../helpers/function';
import { useDebounce, useUpdateEffect } from '../helpers/hooks';
import { SCREEN_READER_MESSAGE_ID } from '../constants';

type MessageFunction = () => JSX.Element;

interface Props extends React.HTMLProps<HTMLInputElement> {
  dateFormat?: string; // Valid date-fns format string
  screenReaderMessage?: MessageFunction | JSX.Element;
}

const DatePickerInput = ({
  dateFormat = 'dd/MM/yyyy',
  screenReaderMessage,
  ...props
}: Props) => {
  const dispatch = React.useContext(DispatchContext);
  const { selectedDate, showCalendar, locale, inputRef } = React.useContext(
    StateContext
  );

  const [value, setValue] = React.useState(
    props.placeholder ? '' : format(selectedDate, dateFormat, { locale })
  );
  const debouncedValue = useDebounce(value, 500);

  useUpdateEffect(() => {
    /**
     * Once the user has stopped typing, try and parse the input
     * value into a date. If the date is valid, update the `selectedDate`
     * to keep the `DatePickerTable` and `DatePickerInput` in sync,
     * otherwise do nothing.
     */
    const newSelectedDate = parse(debouncedValue, dateFormat, new Date());

    if (
      isEqualDate(newSelectedDate, selectedDate) ||
      !isValid(newSelectedDate)
    ) {
      return;
    }

    dispatch({
      type: actionTypes.SET_SELECTED_DATE,
      payload: newSelectedDate
    });
  }, [debouncedValue]);

  useUpdateEffect(() => {
    /**
     * Keep `selectedDate` in sync with the local input `value`.
     * When the user selects a date from the `DatePickerTable`,
     * we need to reflect this selection in the `DatePickerInput`.
     * We use `useUpdateEffect` because we want to ignore the initial
     * render and only sync in response to user interaction.
     */
    setValue(format(selectedDate, dateFormat, { locale }));
  }, [selectedDate]);

  /**
   * Pull out user-provided `onChange` handler (if present).
   * We spread any additional props over the `input` element and
   * need to ensure that our `onChange` handler isn't overwritten
   * by a user-provided one.
   */
  const { onChange: userOnChange, ...rest } = props;

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isFunction(userOnChange)) {
      userOnChange(event);
    }

    setValue(event.target.value);
  };

  const onFocus = () => {
    // with role dialog, the design pattern tells us to set focus to first focusable elem in dialog
    //dispatch({ type: actionTypes.PREVENT_CELL_FOCUS });
    dispatch({ type: actionTypes.ALLOW_CELL_FOCUS });
    // TODO Set focus to current date.
    if (!showCalendar) {
      dispatch({ type: actionTypes.SHOW_CALENDAR });
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type={'text'}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        aria-describedby={SCREEN_READER_MESSAGE_ID}
        {...rest}
      />
      <DatePickerDescription
        message={
          screenReaderMessage && isFunction(screenReaderMessage)
            ? screenReaderMessage()
            : screenReaderMessage
        }
      />
    </>
  );
};

export default DatePickerInput;
