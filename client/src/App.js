import React from 'react';
import './App.css';

import Main from './components/Main';
import Nav from './components/Nav';


function App() {
  return (
    <div className="App">
        <div>
          <Nav/>
          <Main/>
        </div>
    </div>
  );
}

export default App;
