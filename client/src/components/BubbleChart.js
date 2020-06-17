import React from 'react';
import {
     VictoryChart,
     VictoryAxis, 
     VictoryBar, 
     VictoryTheme, 
     VictoryVoronoiContainer,
     VictoryLabel,
     VictoryStack,
     VictoryArea,
     VictoryScatter,
     VictoryZoomContainer,
     createContainer
    } from 'victory';

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

function configData(json) {
    return json.Countries;
}
    
function bubbleChartData(json, metric) {
    let array = configData(json);
    let bubbleData = array.map(obj => ({
        x: obj.TotalDeaths, 
        y: obj[metric], 
        amount: obj.TotalConfirmed, 
        country: obj.Country}));
    return bubbleData;
}


export default class BubbleChart extends React.Component {
    state = {
        loading: true,
        json: {}
       
    };

    async componentDidMount() {
        const url = "https://api.covid19api.com/summary";
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        this.setState({loading: false, json: data});
    }

    render() {
        if (this.state.loading){
            return(<div>loading...</div>);
        }

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
            domain={{x: [0, 130000], y: [0, 700000]}}
            containerComponent={
                <VictoryZoomVoronoiContainer 
                zoomDomain={{x: [0, 130000], y: [0, 700000]}}
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
                         console.log(data.datum.country);
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