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
        countryList: [{value: '', display: '-- Select a country --'}],
        selectedCountry: '',
        totalDeaths: '',
        totalRecovered: '',
        totalConfirmed: '',
    };
        // this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.bubbleChartData = this.bubbleChartData.bind(this);
        this.handleDeathsChange = this.handleDeathsChange.bind(this);
        this.handleRecoveredChange = this.handleRecoveredChange.bind(this);
        this.handleConfirmedChange = this.handleConfirmedChange.bind(this);
        this.updateCountryData = this.updateCountryData.bind(this);
    }

    bubbleChartData(json, metric) {
        console.log(JSON.stringify(json[0]));
        let array = json;
        let bubbleData = array.map(obj => ({
            x: obj[metric],
            y: obj.TotalDeaths,  
            amount: obj.TotalConfirmed, 
            country: obj.Country,
            countryCode: obj.CountryCode
        }));
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
            }).catch(err => err);
    }

    findMax(array, prop){
        if (array.length !== 0){
            let maxObj = array.reduce((max, val) => val[prop] > max[prop] ? val : max);
            let max = maxObj[prop];
            return max;
        }
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
            console.log('why??');
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
        
        // console.log(JSON.stringify(this.state.countryData));
        // console.log(this.state.countryData[0].TotalDeaths);
    }

    handleDeathsChange(event){
        this.setState({totalDeaths: event.target.value});
    }
    handleRecoveredChange(event){
        this.setState({totalRecovered: event.target.value});
    }
    handleConfirmedChange(event){
        this.setState({totalConfirmed: event.target.value});
    }

    updateCountryData(event){
        console.log(this.state.totalDeaths);
        console.log(this.state.totalRecovered);
        console.log(this.state.totalConfirmed);
        event.preventDefault();
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
                <div style={{ display: "flex", flexWrap: "wrap", paddingLeft: "10%", marginTop: -50 }}>
                    <div style={{minWidth: "20%", marginTop: 80}}>
                        <button onClick={this.handleRefresh} style={{margin: 10, padding: 10}}>Refresh</button>
                        <button onClick={this.handleReset} style={{margin: 10, padding: 10}}>Reset</button>
                        <div>
                            <select 
                                style={{padding:3, margin: 20}}
                                value={this.state.selectedCountry}
                                onChange={async(e) => {
                                    await this.setState({selectedCountry: e.target.value});
                                    if (this.state.selectedCountry !== ''){
                                        this.loadCountryData();
                                    }
                                }}>
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
                    </div>
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
                                labels={({ datum }) => `${datum.country}: ${datum.amount} confirmed case(s)`}
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
                            tickFormat={(x) => (`${x / 1000}k`)}
                            label="Total Deaths"
                            style={sharedAxisStyles}
                        ></VictoryAxis>
                        <VictoryScatter
                            style={{ data: { fill: "#c43a31", opacity: "50%" } }}
                            bubbleProperty="amount"
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
                </div>
            ); 
        }
    }
}
