import React, { Component } from 'react';
import { Provider } from 'react-redux';
import HomePage from './HomePage';
import { store } from './store';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <HomePage />
      </Provider>
    );
  }
}

export default App;
