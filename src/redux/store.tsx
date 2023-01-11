import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import reducer from './reducers';
import Reactotron from '../../ReactotronConfig';
import {UserTypes} from './reducers/user/UserTypes';

const appReducer = combineReducers(reducer);

const allMiddleware = [thunk, promise];

const middleware = applyMiddleware(...allMiddleware);

const rootReducer = (state: any, action: any) => {
  /**
   * Reset store state on logout action
   */
  if (action.type === `${`${UserTypes.LOGOUT}_FULFILLED`}`) {
    state = {};
  }
  return appReducer(state, action);
};

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const reactotronEnhancer = Reactotron.createEnhancer
  ? Reactotron.createEnhancer()
  : () => undefined;

const store = createStore(persistedReducer, compose(middleware, reactotronEnhancer));

const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;

export {store, persistor};
