import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './user/user.reducer';

const persistConfig = {
  key: 'root',
  storage,
  whileList: ['user']
};

const rootReducer = combineReducers({
  user: userReducer
});

export default persistReducer<any, any>(persistConfig, rootReducer);
