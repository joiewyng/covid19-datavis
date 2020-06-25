import React from 'react';
import USAData from './USAData';
import BubbleChart from './BubbleChart';


export default class Data extends React.Component {
    render(){
        return (
            <div className="Data">
                <h1 style={{marginTop: 50}}>COVID-19</h1>
                <USAData/>
                <BubbleChart/>
            </div>
        );
    }
}

