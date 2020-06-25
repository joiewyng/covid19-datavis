import React from 'react';
import Temp from './Temp';
import ManageData from './ManageData';
import BubbleChartDb from './BubbleChartDb';

export default class Manage extends React.Component {
    state = {
        loading: true,
        json: {},
    };

    constructor(props) {
        super(props);
        this.handleJson = this.handleJson.bind(this);
    }


    handleJson (dataJson) {
        console.log("handleJson");
        this.setState({
            json: dataJson,
        })
        console.log('handlejson:')
        console.log(this.state.json);
    }

    componentDidMount(){
        console.log("manage json:");
    }

    render(){
        if (this.state.json === {} || !this.state.json){
            return (
                <div className="Manage">
                    <Temp/>
                    <ManageData setJson={this.handleJson}/>
                </div>
            );
        } else {
            return (
                <div className="Manage">
                    {/* <Temp/>
                    <ManageData setJson={this.handleJson}/> */}
                    {/* <BubbleChartDb json={this.state.json}/> */}
                </div>
            );
        };
    }
}

