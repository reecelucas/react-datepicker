import * as React from 'react';
import { SCREEN_READER_MESSAGE_ID } from '../constants';

interface Props {
  message?: JSX.Element;
}

// Visually hide content; only make available to screen readers
const style: React.CSSProperties = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  width: '1px',
  margin: '-1px',
  padding: 0,
  overflow: 'hidden',
  position: 'absolute'
};

const renderDefaultMsg = () => (
  <>
    <p>
      Press the down arrow key to interact with the calendar and select a date.
      The following keyboard shortcuts can be used to change dates.
    </p>
    <ul>
      <li>Enter Key: select the date in focus.</li>
      <li>
        Right and left arrow keys: Move backward (left) and forward (right) by
        one day.
      </li>
      <li>
        Up and down arrow keys: Move backward (up) and forward (down) by one
        week.
      </li>
      <li>Page up and page down keys: Switch months.</li>
      <li>Home and end keys: go to the first or last day of a week.</li>
      <li>Escape key: Return to the date input field.</li>
    </ul>
  </>
);

const DatePickerDescription = ({ message }: Props) => (
  <div id={SCREEN_READER_MESSAGE_ID} style={style}>
    {message || renderDefaultMsg()}
  </div>
);

export default DatePickerDescription;
