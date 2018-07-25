import React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Provider } from 'react-redux';
import configureStore from './src/store';
import configureApi from './src/config/config';
import { ConnectedAppStackNavigator } from './src/navigation';


configureApi();
const store = configureStore();

EStyleSheet.build({
  $buttonBackground: '#603695'
});


export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedAppStackNavigator />
      </Provider>
    );
  }
}
