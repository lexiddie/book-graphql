import { UserActionTypes, CurrentUser } from './user.types';

export const setCurrentUser = (currentUser: CurrentUser) => ({
  type: UserActionTypes.SET_CURRENT_USER,
  payload: currentUser
});

export const signOut = () => ({
  type: UserActionTypes.SIGN_OUT
});
