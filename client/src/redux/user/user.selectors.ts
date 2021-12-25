import { createSelector } from 'reselect';
import { CurrentUser, User } from './user.types';

const selectUser = (state) => state.user;

export const selectCurrentUser = createSelector([selectUser], (user: User) => user.currentUser);

export const selectIsSignIn = createSelector([selectUser], (user: User) => user.isSignIn);

export const selectUserId = createSelector([selectCurrentUser], (currentUser: CurrentUser) => currentUser.id);
