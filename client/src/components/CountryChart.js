import React from 'react';
import {
     VictoryChart,
     VictoryAxis, 
     VictoryTheme, 
     VictoryVoronoiContainer,
     VictoryLabel,
     VictoryLegend,
     VictoryLine
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

function configData(json) {
    const data = [];
    let endIdx = json.length-1;
    for (let i = 0; i <= endIdx; i++){
        let obj = json[i];
        let changeConf = (i===0 ? 0 : (obj.Cases) - json[i-1].Cases);
        // let recovIncr = (i===0 ? 0 : (json[idx+1].Recovered - obj.Recovered));
        // let deathIncr = (i===0 ? 0 : (json[idx+1].Deaths - obj.Deaths));
        // let state = (obj.state ? '' : obj.state);
        data.push({
            index: i,
            date: obj.Date,
            confirmed: obj.Cases,
            changeConf: changeConf
            // changeConfirmed: changeConf
            // positive: obj.positive, 
            // posIncr: posIncr,
            // recovered: obj.recovered,
            // recovIncr: recovIncr,
            // death: obj.death,
            // deathIncr: deathIncr,
            // state: state
        });
    }
    return data;
}

// function lineChartData(json, metric) {
//     let array = configData(json);
//     let lineData = array.map(obj => ({x: obj.index, y: obj[metric]}));
//     return lineData;
// }

function date(index, json){
    let date = json[index].Date.split("T")[0];
    return date;
}

// async function fetchJsonData(cc, type) {
//     const url = "https://api.covid19api.com/total/country/"+cc+"/status/"+type;
//     const response = await fetch(url);
//     const data = await response.json();
//     let prop = type+'Json';
//     this.setState({loading: false, [prop]: data});
// }

export default class CountryChart extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading: true,
            //dates ordered from least recent to most recent
            json: {},
            confirmedJson: {},
            recoveredJson: {},
            deathsJson: {},
        };
    }

    async componentDidMount() {
        let cc = this.props.countryCode.toLowerCase();
        const url = "https://api.covid19api.com/total/country/"+cc+"/status/confirmed";
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        this.setState({loading: false, json: data});
        // await fetchJsonData(cc, "confirmed");
        // await fetchJsonData(cc, "recovered");
        // await fetchJsonData(cc, "deaths");
    }

    render() {
        if (this.state.loading){
            return(<div style={{margin: 20}}>loading...</div>);
        }

        return (
       <>
        <VictoryChart
            height={400}
            width={400}
            
            padding={100}
            theme={VictoryTheme.material}
            
            animate={{
                duration: 100
            }}
            style={{ parent: { maxWidth: "45%", marginLeft: "25%"} }}
            containerComponent={
                <VictoryVoronoiContainer
                  labels={({ datum }) => 
                    `${date(datum.index, this.state.json)}: ${datum.changeConf} case(s)`
                  
                  
                }
                />
              }
        >
        <VictoryLegend 
            orientation="vertical"
            y={100}
            x={295}
            symbolSpacer={10}
            gutter={10}
            style={{  title: {fontSize: 10 } }}
            data={[
            { name: "Positive Cases", symbol: { fill: "red", type: "star" } },
            // { name: "Recoveries", symbol: { fill: "blue", type: "square" } },
            // { name: "Deaths", symbol: { fill: "black", type: "square" } }
            ]}
        />
         <VictoryLabel
            fontSize={5}
            x={200}
            y={60}
            textAnchor="middle"
            text= {this.state.json[0].Country + ": Daily Change in Positive Cases"}
        />
        <VictoryAxis
            style={sharedAxisStyles}
            tickValues={[0, this.state.json.length]}
            tickFormat={[date(0, this.state.json), date(this.state.json.length-1, this.state.json)]}
        ></VictoryAxis>
        <VictoryAxis
            dependentAxis
            tickFormat={(x) => (`${x / 1000}k`)}
            label="Number of People"
            style={sharedAxisStyles}
        ></VictoryAxis>
        <VictoryLine
        interpolation="natural"
        style={{ data: { stroke: "#c43a31" } }}
        data={configData(this.state.json, 'changeConf')}
        x="index"
        y="changeConf"  
        />
{/* 
        <VictoryStack>
                    
            <VictoryArea
            interpolation="natural"
            style={{ data: { fill: "black" } }}
            data={lineChartData(this.state.json, 'deathIncr')}
            />
            <VictoryArea
            interpolation="natural"
            style={{ data: { fill: "blue" } }}
            data={lineChartData(this.state.json, 'recovIncr')}
            />
        </VictoryStack> */}
        </VictoryChart>
 </>
        
        );
    }
}