import React from 'react';
import USAData from './USAData';
import BubbleChart from './BubbleChart';
import Temp from './Temp';


export default class Data extends React.Component {
    render(){
        return (
            <div className="Data">
                <Temp/>
                <h1 style={{marginTop: 50}}>COVID-19</h1>
                <USAData/>
                <BubbleChart/>
            </div>
        );
    }
}

