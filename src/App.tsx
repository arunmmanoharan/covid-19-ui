import React from 'react';
import './App.scss';
import Layout from './components/Layout';
import * as API from './services/API';
import APICache from './services/APICache';
import APICacheContext from './context/APICacheContext';

const App = () => {

  const cache = new APICache(API.load);

  return (
	  <APICacheContext.Provider value={cache}>
	  	<Layout />
	  </APICacheContext.Provider>
  );
}

export default App;
