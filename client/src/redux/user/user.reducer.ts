import { AnyAction } from 'redux';
import { UserActionTypes, CurrentUser } from './user.types';

// type TAction<String, T> = {
//   type: String;
//   payload: T;
// };

// interface ActionWithPayload<TType extends string, TPayload> extends Action<TType> {
//   payload: TPayload;
// }

// type GenericActionCreator<TAction extends ActionWithPayload<string, any>> = (payload: TAction['payload']) => TAction;

type TAction = {
  type: Partial<String>;
  payload: AnyAction;
};

const INITIAL_STATE = {
  currentUser: null,
  isSignIn: false
};

const userReducer = (state = INITIAL_STATE, action: TAction) => {
  switch (action.type) {
    case UserActionTypes.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
        isSignIn: true
      };

    case UserActionTypes.SIGN_OUT:
      return {
        ...state,
        currentUser: null,
        isSignIn: false
      };
    default:
      return state;
  }
};

export default userReducer;
