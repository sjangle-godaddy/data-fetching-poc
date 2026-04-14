import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import usersApi from './api/usersApi';
import postsApi from './api/postsApi';

const rootReducer = combineReducers({
  ...usersApi.reducers,
  ...postsApi.reducers
});

export function makeStore() {
  return createStore(rootReducer, applyMiddleware(thunk));
}
