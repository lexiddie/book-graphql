export const UserActionTypes = {
  SET_CURRENT_USER: 'SET_CURRENT_USER',
  SIGN_OUT: 'SIGN_OUT'
};

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
}

export interface User {
  currentUser: CurrentUser;
  isSignIn: boolean;
}

export interface UserState {
  user: User;
}
