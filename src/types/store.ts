import { AuthState, AuthActions } from './auth';
import { CommandsState, CommandsActions } from './commands';

export interface RootState {
  auth: AuthState;
  commands: CommandsState;
}

export interface RootActions {
  auth: AuthActions;
  commands: CommandsActions;
}

export type AppStore = RootState & RootActions;
