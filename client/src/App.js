import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import apollo client provider
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
//import apollo server provider
import { setContext } from '@apollo/client/link/context';

import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

const httpLink = createHttpLink({
  uri: '/graphql',
});

//create middleware function to retrieve token from local storage and set the httpLink auth header with the token before making the graphql api request
const authLink = setContext((_, { headers }) => {
  //retrieve token from local storage
  const token = localStorage.getItem('id_token');
  //return headers to the context
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

//establish connection to the back-end server's graphql endpoint
const client = new ApolloClient({
  //establish new link to the graphql server at /graphql
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Routes>
            <Route
              path='/'
              element={<SearchBooks />}
            />
            <Route
              path='/saved'
              element={<SavedBooks />}
            />
            <Route
              path='*'
              element={<h1 className='display-2'>Wrong page!</h1>}
            />
          </Routes>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
