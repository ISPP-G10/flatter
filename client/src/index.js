import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './static/css/index.css';
import reportWebVitals from './reportWebVitals';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import * as settings from './settings';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { Toaster } from 'react-hot-toast';

function parseWSLink(uri) {
  if (uri.startsWith('ws')) return uri;
  return uri.replace('http', 'ws');
}

const httpLink = new HttpLink({
  uri: `${settings.API_SERVER}graphql/`
});

const wsLink = new WebSocketLink(
    new SubscriptionClient(parseWSLink(`${settings.API_SERVER}graphql/`), {
      options: {
        reconnect: true
      }
    })
  );

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ApolloProvider client={client}>
    <Toaster position="top-center" reverseOrder={false}/>
    <App />
  </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
