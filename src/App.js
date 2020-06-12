import React from 'react';
import logo from './logo.svg';
import './App.css';
import USAData from './components/USAData';
// import Test from './components/Test';
import StackChart from './components/StackChart';
import BubbleChart from './components/BubbleChart';

function App() {
  return (
    <div className="App">
      {/* <header className="App-header"> */}
        <div>
          <h1 style={{marginTop: 50}}>COVID-19</h1>
          
          <USAData/>
        
          <BubbleChart />
        </div>
        
   
        
        {/* <StackChart /> */}
        {/* <Test/> */}
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      {/* </header> */}
    </div>
  );
}

export default App;
