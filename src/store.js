import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import promiseMiddleware from 'redux-promise';

import rootReducer from './reducers';
let appliedMiddleware;

let isDEV = (typeof __DEV__ !== 'undefined') || (process.env.NODE_ENV !== 'production');
if (isDEV) {
  appliedMiddleware = applyMiddleware(promiseMiddleware, thunk, createLogger());
} else {
  appliedMiddleware = applyMiddleware(promiseMiddleware, thunk);//applyMiddleware(thunk)(createStore);
}
import { livequeryEnhancer } from 'redux-livequery';
//import { livequeryEnhancer } from '../../redux-livequery';

const enhancer = compose(
  livequeryEnhancer(),
  appliedMiddleware,
  window.devToolsExtension ? window.devToolsExtension() : f => f // add support for Redux dev tools,
);

export const store = createStore(rootReducer, { task: { taskList: [], completeSet: {}, activeSet: {} } }, enhancer);