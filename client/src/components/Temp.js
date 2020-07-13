import React from 'react';

const apiUrl = "http://localhost:8080"

export default class Temp extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            apiResponse: "",
            dbResponse: ""
        };
    }
    
    callAPI() {
        fetch(apiUrl + "/testAPI")
            .then(res => res.text())
            .then(res => this.setState({ apiResponse: res }));
    }

    callDB() {
        fetch(apiUrl + "/testDB")
            .then(res => res.text())
            .then(res => {
                // let json = JSON.parse(res);
                // this.setState({ dbResponse: json.msg });
                // console.log(json.msg);
                console.log("GET from Temp res: "+res);
                this.setState({dbResponse: res});
            }).catch(err => err);
    }
    
    componentDidMount() {
        this.callAPI();
        this.callDB();
    }

    render(){
        return (
            <>
            <p className="App-intro">{this.state.apiResponse}</p>
            <p style={{fontSize:10}}className="App-intro">{this.state.dbResponse}</p>

            
            </>
        );
    }
}