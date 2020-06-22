import React from 'react';

export default class ManageData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            apiLink: '',
            apiJson: '',
            dbName: '',
            deleteDb: false,
        };
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
        this.handleCountrySubmit = this.handleCountrySubmit.bind(this);
    }



    handleChange = prop => (event) => {
        this.setState({[prop]: event.target.value});
    }
    
    // pull data from API at [url], set to json, update state apiJson
    async apiToJson (url) {
        // await fetch(url).then(function(response){
        //     return response.json();
        // }).then(function(data){
        //     console.log(data);
        //     this.setState({loading: false, apiJson: data});
        // }).catch(function(err){
        //     console.log('unable to fetch data from API: ' + err);
        // });
        const response = await fetch(url);
        const data = await response.json();
        console.log('GET API data: success')
        // console.log(data);
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
          }).then(function(json){
            console.log(json[0]);
          }).catch(function(err){
              console.log('Failed to send form data to Node: \n'+err);
          });
          alert('Creating a database with the following submission: \n\nAPI link: ' + url+'\nDB name: '+this.state.dbName);
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
            console.log(string);
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

    render(){
        return (
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
            </form>
            
        );
    }
}