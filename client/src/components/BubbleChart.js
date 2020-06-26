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
    
function bubbleChartData(json, metric) {
    let array = json.Countries;
    let bubbleData = array.map(obj => ({
        x: obj[metric],
        y: obj.TotalDeaths, 
        amount: obj.TotalConfirmed, 
        country: obj.Country,
        countryCode: obj.CountryCode
    }));
    return bubbleData;
}


export default class BubbleChart extends React.Component {
    state = {
        loading: true,
        json: {},
        countryCode : ''
    };

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
            this.setState({
                countryCode: event.target.value
            });
            console.log(event.target.value);
            console.log(this.state.countryCode);
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    findMax(array, prop){
        if (array.length !== 0){
            let maxObj = array.reduce((max, val) => val[prop] > max[prop] ? val : max);
            let max = maxObj[prop];
            return max;
        }
    }


    async componentDidMount() {
        const url = "https://api.covid19api.com/summary";
        const response = await fetch(url);
        const data = await response.json();
        // console.log(data);
        this.setState({loading: false, json: data});
    }

    render() {
        if (this.state.loading){
            return(<div>loading...</div>);
        }

        if (this.state.countryCode !== ''){
            return(
                <>
                <button onClick= {() => this.setState({countryCode: ''})}>Back to World Chart</button>
                {/* <form style={{paddingLeft: '55%', marginBottom: '-10px'}} onSubmit={this.handleSubmit}>
                <select value={this.state.countryCode} onChange={this.handleChange}>
                    <option value={this.state.countryCode}>{this.state.countryCode}</option>
                    <option value="fr">France</option>
                    <option value="br">Brazil</option>
                </select>
                </form> */}
                <CountryChart countryCode={this.state.countryCode}/>
                </>
            );
        } else {
            return (
                <div style={{ display: "flex", flexWrap: "wrap", paddingLeft: '15%', marginTop: -50 }}>
                    <VictoryChart
                        style={{ parent: { maxWidth: "80%" } }}
                        height={400}
                        width={500}
                        padding={100}
                        theme={
                            VictoryTheme.material
                        }
                        animate={{
                            duration: 10000
                        }}
                        domain={{
                            x: [0, this.findMax(bubbleChartData(this.state.json, 'TotalRecovered'), 'x') * 1.2],
                            y: [0, this.findMax(bubbleChartData(this.state.json, 'TotalRecovered'), 'y') * 1.2]
                        }}
                        containerComponent={
                            <VictoryZoomVoronoiContainer 
                            zoomDomain={{
                                x: [0, 801000], y: [0, 130000]
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
                            data={bubbleChartData(this.state.json, 'TotalRecovered')}
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
