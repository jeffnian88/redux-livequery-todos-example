import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import promiseMiddleware from 'redux-promise';

import rootReducer from './reducers';


let appliedMiddleware;

let isDEV = (typeof __DEV__ !== 'undefined') || (process.env.NODE_ENV !== 'production');
if (isDEV) {
  appliedMiddleware = applyMiddleware(promiseMiddleware, thunk, createLogger());

  // if (module.hot) {
  //   // Enable Webpack hot module replacement for reducers
  //   module.hot.accept('./reducers', () => {
  //     const nextReducer = require('./reducers').default; // eslint-disable-line global-require
  //     store.replaceReducer(nextReducer);
  //   });
  // }
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