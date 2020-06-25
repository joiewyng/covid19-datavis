import React from 'react';

export default class Temp extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            apiResponse: "",
            dbResponse: ""
        };
    }
    
    callAPI() {
        fetch("http://localhost:9000/testAPI")
            .then(res => res.text())
            .then(res => this.setState({ apiResponse: res }));
    }

    callDB() {
        fetch("http://localhost:9000/testDB")
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