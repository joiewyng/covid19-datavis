import React from 'react';
import BubbleChartDb from './BubbleChartDb';

export default class ManageData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            apiLink: '',
            apiJson: '',
            dbName: '',
            deleteDb: false,
            refreshChart: false
        };
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
        this.handleCountrySubmit = this.handleCountrySubmit.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
    }

    handleChange = prop => (event) => {
        this.setState({[prop]: event.target.value});
    }
    
    // pull data from API at [url], set to json, update state apiJson
    async apiToJson (url) {
 
        const response = await fetch(url);
        const data = await response.json();
        console.log('GET API data: success')
        this.setState({loading: false, apiJson: data});
    }

    async handleSubmit(event) {
        // console.log('handleSubmit for: ' + this.state.dbName);
        event.preventDefault();
        let url = this.state.apiLink;
        await this.apiToJson(url);
        await fetch("http://localhost:9000/testDB", {
            method: 'POST',
            body: JSON.stringify({
                dbName: this.state.dbName,
                json: this.state.apiJson,
            }),
            headers: {"Content-Type": "application/json"}
          })
          .then(function(response){
            console.log('(init) POST to NodeJS endpoint: success')
            return response.json();
          }).then(json => {
            // json (queried from MongoDB) has all the data from the api just submitted
            // this.setState({dataJson: json});
            // console.log(this.state.dataJson);
            console.log(typeof(json));
            this.props.setJson(json);
            // console.log(json);
            return json;
          }).catch(function(err){
              console.log('Failed to send form data to Node: \n'+err);
          });
          alert('Creating a database with the following submission: \n\nAPI link: ' + url+'\nDB name: '+this.state.dbName);
    }

    async handleRefresh(event) {
        event.preventDefault();
        await this.setState({refreshChart: true});
        console.log('handle refresh');
        let url = "http://localhost:9000/testDB?refreshchart=" + this.state.refreshChart;
        await fetch(url)
        .then(function(response){
            return response.json();
        }).then(json => {
            // let json = JSON.parse(res);
            // console.log(json.msg);
            console.log(JSON.stringify(json));
            this.props.setJson(json);
        }).catch(err => err);
    }

    async handleDeleteSubmit(event) {
        // console.log('handleDelete for: ' + this.state.dbName);
        event.preventDefault();
        await this.setState({deleteDb: true});
        let url = "http://localhost:9000/testDB?delete=" + this.state.deleteDb;
        await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                dbName: this.state.dbName,
            }),
            headers: {"Content-Type": "application/json"}
        }).then(function(response){
            console.log('(del) POST to NodeJS endpoint: success')
            return response.text();
        }).then(string => {
            console.log("response string:");
            console.log(string); // nothing: issue in testDB
        }).catch(function(err){
              console.log('Failed to delete DB: \n'+err);
          });
          alert('The following database will be deleted: '+this.state.dbName);
        
    }

    async handleCountrySubmit(event) {
        console.log('handleCountry for: ' + this.state.dbName);
        event.preventDefault();
        let url = "http://localhost:9000/testDB?country=" + this.state.country;
        await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                dbName: this.state.dbName,
            }),
            headers: {"Content-Type": "application/json"}
          })
          .then(function(response){
            console.log('(country) POST to NodeJS endpoint: success')

            console.log(response);
            return response;
          }).catch(function(err){
              console.log('Failed retrieve country data: \n'+err);
          });
          alert('Retrieving data from: '+this.state.dbName+' on '+this.state.country);
    }

    componentDidMount(){
        console.log("manageData mount called")
    }

    render(){
        return (
            <div>
                <form style={{margin: 30}} onSubmit={this.handleSubmit}>
                    <label style={{margin: 15}}>
                        DB Name: &nbsp;
                        <input type="text" name="dbName" value={this.state.dbName} onChange={this.handleChange('dbName')}/>
                    </label>
                    <label style={{margin: 15}}>
                        API Link: &nbsp;
                        <input type="text" name="apiLink" value={this.state.apiLink} onChange={this.handleChange('apiLink')}/>
                    </label>
                    <input type="submit" name="initDB" value="Initialize Database" style={{margin: 15}}/>
                    <button onClick={this.handleDeleteSubmit} style={{margin: 15}}>Delete Database</button>
                    <label style={{margin: 15}}>
                        Country: &nbsp;
                        <input type="text" name="apiLink" value={this.state.country} onChange={this.handleChange('country')}/>
                    </label>
                    <button onClick={this.handleCountrySubmit} style={{margin: 15}}>Search</button>
                    <button onClick={this.handleRefresh} style={{margin: 15}}>Refresh</button>
                </form>
                {/* <BubbleChartDb/> */}
            </div> 
        );
    }
}