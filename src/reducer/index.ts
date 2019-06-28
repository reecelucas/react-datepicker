import { DatePickerState, Action } from '../types';
import { getYear, getMonth } from 'date-fns';
import * as actionTypes from './actionTypes';

export default (state: DatePickerState, action: Action) => {
  switch (action.type) {
    case actionTypes.INCREMENT_YEAR:
      return {
        ...state,
        year: state.year + 1
      };
    case actionTypes.DECREMENT_YEAR:
      return {
        ...state,
        year: state.year - 1
      };
    case actionTypes.INCREMENT_MONTH: {
      const newMonth = state.month + 1;
      const isNewYear = newMonth > 11;

      return {
        ...state,
        month: isNewYear ? 0 : newMonth,
        year: isNewYear ? state.year + 1 : state.year
      };
    }
    case actionTypes.DECREMENT_MONTH: {
      const newMonth = state.month - 1;
      const isNewYear = newMonth < 0;

      return {
        ...state,
        month: isNewYear ? 11 : newMonth,
        year: isNewYear ? state.year - 1 : state.year
      };
    }
    case actionTypes.SET_SELECTED_DATE:
      return {
        ...state,
        year: getYear(action.payload),
        month: getMonth(action.payload),
        selectedDate: action.payload,
        focussedDate: action.payload // Keep the `selectedDate` and `focussedDate` in sync
      };
    case actionTypes.SET_FOCUSSED_DATE:
      return {
        ...state,
        year: getYear(action.payload),
        month: getMonth(action.payload),
        focussedDate: action.payload
      };
    case actionTypes.ALLOW_CELL_FOCUS:
      return {
        ...state,
        allowCellFocus: true
      };
    case actionTypes.PREVENT_CELL_FOCUS:
      return {
        ...state,
        allowCellFocus: false
      };
    case actionTypes.SHOW_CALENDAR:
      return {
        ...state,
        showCalendar: true
      };
    case actionTypes.HIDE_CALENDAR:
      return {
        ...state,
        year: getYear(state.selectedDate),
        month: getMonth(state.selectedDate),
        focussedDate: state.selectedDate,
        showCalendar: false
      };
    default:
      return state;
  }
};
