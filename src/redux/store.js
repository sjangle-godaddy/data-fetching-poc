import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import todosApi from './api/todosApi';

const rootReducer = combineReducers({
  ...todosApi.reducers
});

export function makeStore() {
  return createStore(rootReducer, applyMiddleware(thunk));
}
