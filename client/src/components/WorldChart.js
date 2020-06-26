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
        countryCode : '',
        firstLoad: true,
    };
        // this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.bubbleChartData = this.bubbleChartData.bind(this);
    }

    bubbleChartData(json, metric) {
        console.log(JSON.stringify(json));
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

    callDB() {
        fetch("http://localhost:9000/worldDB")
            .then(res => {
                return res.json();
            }).then(json => {
                this.setState({json: json});
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

    async componentDidMount() {
        if (this.state.firstLoad) {
            const url = "https://api.covid19api.com/summary";
            const response = await fetch(url);
            const data = await response.json();
            this.setState({loading: false, json: data.Countries, firstLoad: false});
        }
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
                    {/* <div style={{minWidth: "20%"}}> */}
                        <button onClick={this.handleRefresh}>Refresh</button>
                        <button onClick={this.handleReset}>Reset</button>
                    {/* </div> */}
                    <VictoryChart
                        style={{ parent: { maxWidth: "80%" } }}
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
