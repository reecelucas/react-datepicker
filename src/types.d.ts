export type Action =
  | { type: 'INCREMENT_YEAR' }
  | { type: 'DECREMENT_YEAR' }
  | { type: 'INCREMENT_MONTH' }
  | { type: 'DECREMENT_MONTH' }
  | { type: 'SET_SELECTED_DATE'; payload: Date }
  | { type: 'SET_FOCUSSED_DATE'; payload: Date }
  | { type: 'ALLOW_CELL_FOCUS' }
  | { type: 'PREVENT_CELL_FOCUS' }
  | { type: 'SHOW_CALENDAR' }
  | { type: 'HIDE_CALENDAR' };

export interface DatePickerState {
  year: number;
  month: number;
  focussedDate: Date;
  selectedDate: Date;
  showCalendar: boolean;
  allowCellFocus: boolean;
}

export interface DatePickerProps {
  children: React.ReactNode;
  onSelect: (selectedDate: Date) => void;
  initialDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  excludeDates?: Date[];
  includeDates?: Date[];
  locale?: Locale; // Date-fns `locale` object
}

export type ContextProps = DatePickerState &
  Omit<DatePickerProps, 'children' | 'onSelect' | 'initialDate'>;
