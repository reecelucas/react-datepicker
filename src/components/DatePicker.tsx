import * as React from 'react';
import {
  addDays,
  subDays,
  getYear,
  getMonth,
  subMonths,
  addMonths,
  startOfWeek,
  lastDayOfWeek
} from 'date-fns';
import { StateContext, DispatchContext } from './DatePickerContext';
import reducer from '../reducer';
import * as actionTypes from '../reducer/actionTypes';
import { getClosestSelectableDate } from '../helpers/date';
import { useUpdateEffect } from '../helpers/hooks';
import { DatePickerProps } from '../types';

type Props = DatePickerProps & React.HTMLProps<HTMLDivElement>;

const DatePicker = ({
  children,
  onSelect,
  initialDate = new Date(Date.now()),
  minDate,
  maxDate,
  excludeDates,
  includeDates,
  locale,
  ...props
}: Props) => {
  /*******************************************
   * STATE + COMPUTED PROPERTIES
   ******************************************/

  const calendarRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const initDate = getClosestSelectableDate({
    date: initialDate,
    minDate,
    maxDate,
    excludeDates,
    includeDates
  });

  const [state, dispatch] = React.useReducer(reducer, {
    year: getYear(initDate),
    month: getMonth(initDate),
    focussedDate: initDate,
    selectedDate: initDate,
    showCalendar: false,
    allowCellFocus: false
  });

  /*******************************************
   * HELPERS
   ******************************************/
  const setFocussedDate = (date: Date) => {
    dispatch({
      type: actionTypes.SET_FOCUSSED_DATE,
      payload: date
    });
  };

  /*******************************************
   * SIDE EFFECTS
   ******************************************/

  React.useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  React.useEffect(() => {
    document.addEventListener('click', onClickOutside, true);

    return () => {
      document.removeEventListener('click', onClickOutside, true);
    };
  });

  useUpdateEffect(() => {
    /**
     * We use `useUpdateEffect` because we want to ignore the
     * initial render and only call the `onSelect` callback in
     * response to user interaction.
     */
    onSelect(state.selectedDate);
  }, [state.selectedDate]);

  /*******************************************
   * EVENT HANDLERS
   ******************************************/

  const onClickOutside = (event: Event) => {
    const isInput =
      inputRef &&
      inputRef.current &&
      inputRef.current.contains(event.target as Node);
    const isCalendar =
      calendarRef &&
      calendarRef.current &&
      calendarRef.current.contains(event.target as Node);

    if (event.target && state.showCalendar && !(isInput || isCalendar)) {
      dispatch({ type: actionTypes.HIDE_CALENDAR });
    }
  };

  const onInputKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Down' || event.key === 'ArrowDown') {
      event.preventDefault();

      /**
       * The DatePicker is initialised with `allowCellFocus` set
       * to false. This is to prevent focus immediately jumping to
       * the `focussedDate` when `showCalendar` is set to true. When the
       * user presses the down arrow, we need to enable cell focus and
       * set the `focussedDate` to the currently `selectedDate`.
       */
      dispatch({ type: actionTypes.ALLOW_CELL_FOCUS });
      setFocussedDate(state.selectedDate);
    }
  };

  const onCellKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLButtonElement;
    const isDisabled = target && target.matches('[aria-disabled="true"]');

    /**
     * If the user tabs from the `DatePickerInput` component, as
     * opposed to pressing `ArrowDown`, `allowCellFocus` will not have
     * been switched to true, and the user will not be able to navigate
     * between cells using the keyboard, so we set it here.
     */
    if (!state.allowCellFocus) {
      dispatch({ type: actionTypes.ALLOW_CELL_FOCUS });
    }

    switch (event.key) {
      case 'PageUp':
        event.preventDefault();
        setFocussedDate(subMonths(state.focussedDate, 1));
        break;

      case 'PageDown':
        event.preventDefault();
        setFocussedDate(addMonths(state.focussedDate, 1));
        break;

      case 'Up': // IE/Edge non-standard value
      case 'ArrowUp':
        event.preventDefault();
        setFocussedDate(subDays(state.focussedDate, 7));
        break;

      case 'Down': // IE/Edge non-standard value
      case 'ArrowDown':
        event.preventDefault();
        setFocussedDate(addDays(state.focussedDate, 7));
        break;

      case 'Left': // IE/Edge non-standard value
      case 'ArrowLeft':
        event.preventDefault();
        setFocussedDate(subDays(state.focussedDate, 1));
        break;

      case 'Right': // IE/Edge non-standard value
      case 'ArrowRight':
        event.preventDefault();
        setFocussedDate(addDays(state.focussedDate, 1));
        break;

      case 'Home':
        event.preventDefault();
        setFocussedDate(startOfWeek(state.focussedDate));
        break;

      case 'End':
        event.preventDefault();
        setFocussedDate(lastDayOfWeek(state.focussedDate));
        break;

      case 'Spacebar': // IE/Edge non-standard value
      case ' ':
      case 'Enter': {
        if (!isDisabled) {
          event.preventDefault();
          dispatch({
            type: actionTypes.SET_SELECTED_DATE,
            payload: state.focussedDate
          });
        }
      }
    }
  };
  const onTabKeyDown = (event: KeyboardEvent) => {
    // not very clean :(
    const focusableElements = document.querySelectorAll("div[role='dialog'] button:not([tabindex='-1'])");
    const firstFocusableEl = focusableElements[0];
    const lastFocusableEl = focusableElements[focusableElements.length-1];
    // make focus trap
    if (event.shiftKey && document.activeElement === firstFocusableEl) {
      event.preventDefault();
      lastFocusableEl.focus();
    } else if (!event.shiftKey && document.activeElement === lastFocusableEl) {
      event.preventDefault();
      firstFocusableEl.focus();
    }
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (!state.showCalendar) {
      return;
    }

    const target = event.target as HTMLButtonElement | HTMLInputElement;
    const isInput = target && target.matches('input');
    const isTableCell = target && target.matches('button');

    if (event.key === 'Esc' || event.key === 'Escape') {
      // todo : set focus back to input
      dispatch({ type: actionTypes.HIDE_CALENDAR });
      return;
    }

    if (isInput) {
      onInputKeyDown(event);
      return;
    }

    if (isTableCell) {
      onCellKeyDown(event);
    }

    if (event.key === 'Tab') {
      onTabKeyDown(event);
      return;
    }
  };

  /*******************************************
   * RENDER
   ******************************************/

  const getContextValues = () => ({
    ...state,
    minDate,
    maxDate,
    excludeDates,
    includeDates,
    locale,
    calendarRef,
    inputRef
  });

  return (
    <StateContext.Provider value={getContextValues()}>
      <DispatchContext.Provider value={dispatch}>
        <div {...props}>{children}</div>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export default DatePicker;
