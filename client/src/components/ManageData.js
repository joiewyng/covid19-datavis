import React from 'react';

export default class ManageData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            apiLink: '',
            apiJson: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }



    handleChange(event) {
        this.setState({apiLink: event.target.value});
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
        console.log('get: success')
        console.log(data);
        this.setState({loading: false, apiJson: data});
    }

    async handleSubmit(event) {
        event.preventDefault();
        let url = this.state.apiLink;
        console.log("huh");
        await this.apiToJson(url);
        await fetch("http://localhost:9000/testDB", {
            method: 'POST',
            body: JSON.stringify(this.state.apiJson),
            headers: {"Content-Type": "application/json"}
          })
          .then(function(response){
            console.log('post: success')
            console.log(response)
            return response.json()
          }).catch(function(err){
              console.log('failed to send API data to Node: '+err);
          });
          alert('An API link was submitted: ' + url);
        
    }

    render(){
        return (
            <form style={{margin: 30}} onSubmit={this.handleSubmit}>
                <label>
                    API Link: &nbsp;
                    <input type="text" name="apiLink" value={this.state.value} onChange={this.handleChange}/>
                </label>
                <input type="submit" value="Initialize Database" />
            </form>
        );
    }
}