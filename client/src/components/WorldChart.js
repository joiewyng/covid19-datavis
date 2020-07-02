import React from 'react';
import {
     VictoryChart,
     VictoryAxis, 
     VictoryTheme, 
     VictoryLabel,
     VictoryScatter,
     createContainer,
    } from 'victory';
import CountryChart from './CountryChart'

const sharedAxisStyles = {
    tickLabels: {
        fontSize: 10
    },
    axisLabel: {
        padding: 45,
        fontSize: 10,
        fontStyle: "italic"
    }
    };

const VictoryZoomVoronoiContainer = createContainer("zoom", "voronoi");
    


export default class WorldChart extends React.Component {
    

    constructor(props) {
        super(props);
        this.state = {
        loading: true,
        json: {},
        countryCode: '',
        firstLoad: true,
        fileList: [{value: '', display: '-- Select a dataset --'}],
        selectedFile: '',
        countryList: [{value: '', display: '-- Select a country --'}],
        selectedCountry: '',
        totalDeaths: '',
        totalRecovered: '',
        totalConfirmed: '',
        newCountryName: '',
        newTotalDeaths: '',
        newTotalRecovered: '',
        newTotalConfirmed: '',
        selectedBubbleMetric: 'amount',
    };
        // this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleRestore = this.handleRestore.bind(this);
        this.bubbleChartData = this.bubbleChartData.bind(this);
        this.handleDeathsChange = this.handleDeathsChange.bind(this);
        this.handleRecoveredChange = this.handleRecoveredChange.bind(this);
        this.handleConfirmedChange = this.handleConfirmedChange.bind(this);
        this.updateCountryData = this.updateCountryData.bind(this);
        this.handleNewCountryName = this.handleNewCountryName.bind(this);
        this.handleNewDeathsChange = this.handleNewDeathsChange.bind(this);
        this.handleNewRecoveredChange = this.handleNewRecoveredChange.bind(this);
        this.handleNewConfirmedChange = this.handleNewConfirmedChange.bind(this);
        this.addCountry = this.addCountry.bind(this);
    }

    bubbleChartData(json, metric) {
        // console.log(JSON.stringify(json[0]));
        let array = json;
        let bubbleData = array.map(obj => ({
            x: obj[metric],
            y: obj.TotalDeaths,  
            amount: obj.TotalConfirmed, 
            country: obj.Country,
            countryCode: obj.CountryCode
        }));
        // console.log(bubbleData);
        return bubbleData;
    }

    // handleChange(event) {
    //     this.setState({
    //         countryCode: event.target.value
    //     });
    //     console.log(event.target.value);
    //     console.log(this.state.countryCode);
    // }

    handleSubmit(event) {
        event.preventDefault();
    }

    async callDB() {
        await fetch("http://localhost:9000/worldDB")
            .then(res => {
                return res.json();
            }).then(json => {
                this.setState({json: Array.from(json)});
                console.log(Array.from(json));
            }).catch(err => err);
    }

    findMax(array, prop){
        // if (array.length !== 0){
            let maxObj = array.reduce((max, val) => val[prop] > max[prop] ? val : max);
            let max = maxObj[prop];
            console.log(max);
            return max;
        // }
    }

    async handleReset(event) {
        event.preventDefault();
        let url = "http://localhost:9000/worldDB?reset=true"
        await fetch(url, {
            method: 'POST'
        }).then(function(response){
            return response.json();
        }).then(dataJson => {
            this.setState({json: Array.from(dataJson)});
            console.log('reset:')
            console.log(JSON.stringify(dataJson));
            return this.state.json
        }).catch(err => err);
    }

    async handleRefresh(event) {
        event.preventDefault();
        let url = "http://localhost:9000/worldDB";
        await fetch(url)
        .then(function(response){
            return response.json();
        }).then(dataJson => {
            this.setState({json: Array.from(dataJson)});
            return this.state.json
        }).catch(err => err);
    }

    async handleRestore(event) {
        event.preventDefault();
        let url = "http://localhost:9000/worldDB?restore=true&file=" + this.state.selectedFile;
        await fetch(url, {
            method: 'POST'
        }).then(function(response){
            return response.json();
        }).then(dataJson => {
            this.setState({json: Array.from(dataJson)});
            console.log('restore');
            console.log(JSON.stringify(dataJson));
            return this.state.json
        }).catch(err => err);
    }

    async handleSave(event) {
        // event.preventDefault();
        let url = "http://localhost:9000/worldDB?save=true"
        await fetch(url, {
            method: 'POST'
        }).then(function(response){
            return response.json();
        }).then(dataJson => {
            console.log('saved');
            return dataJson
        }).catch(err => err);
    }

   async loadCountries() {
        let url = "http://localhost:9000/worldDB/countrylist";
        await fetch(url)
        .then((response) => {
            return response.json();
        }).then(data => {
            let countryList = data.map(country => {
              return {value: country.Country, display: country.Country}
            });
            this.setState({
              countryList: [{value: '', display: '-- Select a country --'}].concat(countryList)
            });
        }).catch(error => {
            console.log(error);
        });
    }

    async loadFileNames() {
        let url = "http://localhost:9000/worldDB/filelist";
        await fetch(url)
        .then((response) => {
            return response.json();
        }).then(data => {
            let fileList = data.map(file => {
              return {value: file, display: file}
            });
            this.setState({
              fileList: [{value: '', display: '-- Select a dataset --'}].concat(fileList)
            });
        }).catch(error => {
            console.log(error);
        });
    }

    async loadCountryData() {
        console.log('country data loaded');
        let url = "http://localhost:9000/worldDB/country?name="+this.state.selectedCountry;
        await fetch(url)
        .then((response) => {
            return response.json();
        }).then(dataJson => {
            this.setState({
                totalRecovered: dataJson[0].TotalRecovered,
                totalDeaths: dataJson[0].TotalDeaths,
                totalConfirmed: dataJson[0].TotalConfirmed,
                // countryData: dataJson,
            })
        })
    }

    handleDeathsChange(event){
        this.setState({totalDeaths: Number(event.target.value)});
    }
    handleRecoveredChange(event){
        this.setState({totalRecovered:  Number(event.target.value)});
    }
    handleConfirmedChange(event){
        this.setState({totalConfirmed:  Number(event.target.value)});
    }
    handleNewCountryName(event){
        console.log(event.target.value);
        this.setState({newCountryName: event.target.value});
    }
    handleNewDeathsChange(event){
        this.setState({newTotalDeaths: Number(event.target.value)});
    }
    handleNewRecoveredChange(event){
        this.setState({newTotalRecovered: Number(event.target.value)});
    }
    handleNewConfirmedChange(event){
        this.setState({newTotalConfirmed: Number(event.target.value)});
    }

    async updateCountryDataRequest() {
        let url = "http://localhost:9000/worldDB/country?name="+this.state.selectedCountry;
        await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                totalDeaths: this.state.totalDeaths,
                totalRecovered: this.state.totalRecovered,
                totalConfirmed: this.state.totalConfirmed,
            }),
            headers: {"Content-Type": "application/json"}
        }).then(function(response){
            return response.json();
        }).then(dataJson => {
            console.log(Array.from(dataJson));
            this.setState({json: Array.from(dataJson)});
            return this.state.json
        }).catch(err => err);
    }

    async addCountryRequest() {
        let url = "http://localhost:9000/worldDB/addcountry";
        await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                Country: this.state.newCountryName,
                TotalConfirmed: this.state.newTotalConfirmed,
                TotalDeaths: this.state.newTotalDeaths,
                TotalRecovered: this.state.newTotalRecovered,
            }),
            headers: {"Content-Type": "application/json"}
        }).then(function(response){
            return response.json();
        }).then(dataJson => {
            this.setState({json: Array.from(dataJson)});
            console.log(JSON.stringify(dataJson));
            return this.state.json
        }).catch(err => err);
    }

    async updateCountryData(event){
        event.preventDefault();
        await this.updateCountryDataRequest();
    }

    async addCountry(event){
        event.preventDefault();
        await this.addCountryRequest();
    }

    async componentDidMount() {
        // // pulls data from public api on refresh
        // if (this.state.firstLoad) {
        //     const url = "https://api.covid19api.com/summary";
        //     const response = await fetch(url);
        //     const data = await response.json();
        //     this.setState({loading: false, json: data.Countries, firstLoad: false});
        // }
        await this.callDB();
        await this.loadFileNames();
        await this.loadCountries();
        this.setState({loading: false});
    }

    render() {
        if (this.state.loading){
            return(<div>loading...</div>);
        }

        if (this.state.countryCode !== ''){
            return(
            <>
                <button onClick= {() => this.setState({countryCode: ''})}>Back to World Chart</button>
                <CountryChart countryCode={this.state.countryCode}/>
            </>
            );
        } else {
            return (
                <div style={{ display: "flex", flexWrap: "wrap", padding: "5%", marginTop: -50 }}>
                    <VictoryChart
                        style={{ parent: { maxWidth: "70%" }}}
                        height={400}
                        width={500}
                        padding={100}
                        theme={
                            VictoryTheme.material
                        }
                        animate={{
                            duration: 1000
                        }}
                        domain={{
                            x: [0, this.findMax(this.bubbleChartData(this.state.json, 'TotalRecovered'), 'x') * 1.2],
                            y: [0, this.findMax(this.bubbleChartData(this.state.json, 'TotalRecovered'), 'y') * 1.2]
                        }}
                        containerComponent={
                            <VictoryZoomVoronoiContainer 
                                zoomDomain={{
                                    x: [0, this.findMax(this.bubbleChartData(this.state.json, 'TotalRecovered'), 'x')*1.2],
                                    y: [0, this.findMax(this.bubbleChartData(this.state.json, 'TotalRecovered'), 'y')*1.2]
                                }}
                                labels={({ datum }) => {
                                    if (this.state.selectedBubbleMetric == 'amount'){
                                        return `${datum.country}: ${datum.amount} confirmed case(s)`
                                    } else if (this.state.selectedBubbleMetric == 'x'){
                                        return `${datum.country}: ${datum.x} recoveries`
                                    } else {
                                        return `${datum.country}: ${datum.y} deaths`
                                    }
                                }}
                            />
                        }
                    >   
                        <VictoryLabel
                            fontSize={10}
                            x={250}
                            y={60}
                            textAnchor="middle"
                            text="World: Total Deaths vs Recoveries per Country"
                        />
                        <VictoryAxis
                            style={sharedAxisStyles}
                            tickFormat={(x) => (`${x / 1000}k`)}
                            label="Total Recoveries"
                        ></VictoryAxis>
                        <VictoryAxis
                            dependentAxis
                            tickFormat={(x, i, ticks) => (`${x / 1000}k`)}
                            label="Total Deaths"
                            style={sharedAxisStyles}
                        ></VictoryAxis>
                        <VictoryScatter
                            style={{ data: { fill: "#c43a31", opacity: "50%" } }}
                            bubbleProperty={this.state.selectedBubbleMetric}
                            maxBubbleSize={20}
                            minBubbleSize={1}
                            data={this.bubbleChartData(this.state.json, 'TotalRecovered')}
                            events={[{
                                target: 'data',
                                eventHandlers: {
                                    onClick: (event, data) => {
                                        let cCode = data.datum.countryCode
                                        console.log(cCode);
                                        this.setState({countryCode: cCode});
                                    },
                                },
                            }]}
                        >
                        </VictoryScatter>
                    </VictoryChart>
                    <div style={{minWidth: "20%", marginTop: 80}}>
                        <div> Bubble Size: 
                            <select 
                                style={{padding:3, margin: 20}}
                                value={this.state.selectedDataFile}
                                onChange={async(e) => {
                                    await this.setState({selectedBubbleMetric: e.target.value});
                                }}
                            >
                                
                                <option key='Confirmed' value='amount'>Confirmed</option>
                                <option key='Recovered' value='x'>Recoveries</option>
                                <option key='Deaths' value='y'>Deaths</option>
                            </select>
                        </div>
                        <hr></hr>
                        <button onClick={this.handleRefresh} style={{margin: 10, padding: 5}}>Refresh</button>
                        <button onClick={this.handleSave} style={{margin: 10, padding: 5}}>Save Dataset</button>
                        <button onClick={this.handleReset} style={{margin: 10, padding: 5}}>Reset</button>
                        
                        <div>
                            <select 
                                style={{padding:3, margin: 20}}
                                value={this.state.selectedDataFile}
                                onChange={async(e) => {
                                    await this.setState({selectedFile: e.target.value});
                                    if (this.state.selectedFile !== ''){
                                        this.loadFileNames();
                                    }
                                }}
                            >
                                {this.state.fileList.map((file) => 
                                <option key={file.value} value={file.value}>{file.display}</option>
                                )}
                            </select>
                            <button onClick={this.handleRestore} style={{margin: 8, padding: 5}}>Restore</button>
                        </div>
                        <hr></hr>
                        <div>
                            <select 
                                style={{padding:3, margin: 20}}
                                value={this.state.selectedCountry}
                                onChange={async(e) => {
                                    await this.setState({selectedCountry: e.target.value});
                                    if (this.state.selectedCountry !== ''){
                                        this.loadCountryData();
                                    }
                                }}
                            >
                                {console.log(this.state.selectedCountry)}
                                {this.state.countryList.map((country) => 
                                <option key={country.value} value={country.value}>{country.display}</option>
                                )}
                            </select>
                        </div>
                        <form onSubmit={this.updateCountryData}>
                            <div>
                                <label style={{width: 70, float: 'left', margin: 10}}>
                                    Deaths:  
                                </label>
                                <input type="text" value={this.state.totalDeaths} onChange={this.handleDeathsChange} style={{margin: 10}}/>
                            </div>
                            <div>
                                <label style={{width: 70, float: 'left', margin: 10}}>
                                    Recovered:
                                </label>
                                <input type="text" value={this.state.totalRecovered} onChange={this.handleRecoveredChange} style={{margin: 10}}/>
                            </div>
                            <div>
                                <label style={{width: 70, float: 'left', margin: 10}}>
                                    Confirmed:
                                </label>
                                <input type="text" value={this.state.totalConfirmed} onChange={this.handleConfirmedChange} style={{margin: 10}}/>
                            </div>
                            
                            <input type="submit" value="Update" style={{margin: 10, float: 'right'}}/>
                        </form>
                        <br/><br/>
                        <hr></hr>
                        <form onSubmit={this.addCountry}>
                            <div style={{margin: 10}}><strong>Add a Country</strong></div>
                            <div>
                                <label style={{width: 70, float: 'left', margin: 10}}>
                                    Name:  
                                </label>
                                <input type="text" value={this.state.newCountryName} onChange={this.handleNewCountryName} style={{margin: 10}}/>
                            </div>
                            <div>
                                <label style={{width: 70, float: 'left', margin: 10}}>
                                    Deaths:  
                                </label>
                                <input type="text" value={this.state.newTotalDeaths} onChange={this.handleNewDeathsChange} style={{margin: 10}}/>
                            </div>
                            <div>
                                <label style={{width: 70, float: 'left', margin: 10}}>
                                    Recovered:
                                </label>
                                <input type="text" value={this.state.newTotalRecovered} onChange={this.handleNewRecoveredChange} style={{margin: 10}}/>
                            </div>
                            <div>
                                <label style={{width: 70, float: 'left', margin: 10}}>
                                    Confirmed:
                                </label>
                                <input type="text" value={this.state.newTotalConfirmed} onChange={this.handleNewConfirmedChange} style={{margin: 10}}/>
                            </div>
                            
                            <input type="submit" value="Add" style={{margin: 10, float: 'right'}}/>
                        </form>
                    </div>
                </div>
            ); 
        }
    }
}
