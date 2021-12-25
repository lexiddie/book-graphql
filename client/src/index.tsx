import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ApolloProvider, ApolloClient, NormalizedCacheObject, DefaultOptions } from '@apollo/client';

import { store, persistor } from './redux/store';

import AppLayout from './components/app-layout/app-layout.component';
import { cache } from './cache';

import theme from './theme/index';
import './sass/index.scss';

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore'
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  }
};

// Set up our apollo-client to point at the server we created
// this can be local or a remote endpoint
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: cache,
  uri: 'http://localhost:3000/graphql',
  headers: {
    authorization: localStorage.getItem('token') || '',
    'client-name': 'Book GraphQL [Web]',
    'client-version': '1.0.0'
  },
  resolvers: {},
  connectToDevTools: true,
  defaultOptions: defaultOptions
});

const rootElement = document.getElementById('root');

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <Provider store={store}>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <PersistGate persistor={persistor}>
            <AppLayout>
              <App />
            </AppLayout>
          </PersistGate>
        </BrowserRouter>
      </ApolloProvider>
    </Provider>
  </ChakraProvider>,
  rootElement
);
