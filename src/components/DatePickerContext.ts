import * as React from 'react';
import { Action, ContextProps } from '../types';

export const StateContext = React.createContext<ContextProps>(
  {} as ContextProps
);

export const DispatchContext = React.createContext<React.Dispatch<Action>>(
  {} as React.Dispatch<Action>
);
