import * as React from 'react';
import { addMonths, subMonths, isSameMonth } from 'date-fns';
import { StateContext, DispatchContext } from './DatePickerContext';
import * as actionTypes from '../reducer/actionTypes';
import { isFunction } from '../helpers/function';

interface UpdateMonthParams {
  prev: () => void;
  next: () => void;
}

// See https://tinyurl.com/y29rk4m5
interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children: React.ReactNode;
  updateMonth: ({ prev, next }: UpdateMonthParams) => void;
}

const DatePickerButton = ({ children, updateMonth, ...props }: Props) => {
  const dispatch = React.useContext(DispatchContext);
  const { year, month, selectedDate, allowCellFocus } = React.useContext(
    StateContext
  );

  const setFocus = (date: Date) => {
    /**
     * If the user tabs from the `DatePickerInput` component, as
     * opposed to pressing `ArrowDown`, `allowCellFocus` will not have
     * been set to true. To enable setting focus below we need to
     * first update `allowCellFocus`.
     */
    if (!allowCellFocus) {
      dispatch({ type: actionTypes.ALLOW_CELL_FOCUS });
    }

    /**
     * If the `date` given is the same month as the currently
     * selected date, assign focus to the `selectedDate`, else
     * assign focus to the `date` given.
     */
    dispatch({
      type: actionTypes.SET_FOCUSSED_DATE,
      payload: isSameMonth(date, selectedDate) ? selectedDate : date
    });
  };

  const prev = () => {
    dispatch({ type: actionTypes.DECREMENT_MONTH });
    setFocus(subMonths(new Date(year, month), 1)); // Attempt to focus first day of month
  };

  const next = () => {
    dispatch({ type: actionTypes.INCREMENT_MONTH });
    setFocus(addMonths(new Date(year, month), 1)); // Attempt to focus first day of month
  };

  /**
   * Pull out user-provided `onClick` handler (if present).
   * We spread any additional props over the `button` element and
   * need to ensure that our `onClick` handler isn't overwritten
   * by a user-provided one.
   */
  const { onClick: userOnClick, ...rest } = props;

  const render = () => (
    <button
      type={'button'}
      onClick={event => {
        if (isFunction(userOnClick)) {
          userOnClick(event);
        }

        updateMonth({ prev, next });
      }}
      {...rest}
    >
      {children}
    </button>
  );

  // Only re-render if the context values or props have changed...
  return React.useMemo(render, [
    children,
    updateMonth,
    year,
    month,
    selectedDate,
    allowCellFocus,
    dispatch,
    ...Object.keys(props)
  ]);
};

export default DatePickerButton;
