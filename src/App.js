import React from 'react';
import logo from './logo.svg';
import './App.css';
import USAData from './components/USAData';
import BubbleChart from './components/BubbleChart';

function App() {
  return (
    <div className="App">
        <div>
          <h1 style={{marginTop: 50}}>COVID-19</h1>
          <USAData/>
          <BubbleChart />
        </div>
    </div>
  );
}

export default App;
