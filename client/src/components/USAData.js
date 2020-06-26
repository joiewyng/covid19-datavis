import React from 'react';
import {
     VictoryChart,
     VictoryAxis, 
     VictoryBar, 
     VictoryTheme, 
     VictoryVoronoiContainer,
     VictoryLabel,
     VictoryArea,
     VictoryLine,
     VictoryLegend,
     VictoryStack,
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
    for (let i = endIdx; i >= 0; i--){
        let idx = endIdx-i;
        let obj = json[idx];
        let posIncr = (i===0 ? 0 : (obj.positive - json[idx+1].positive));
        let recovIncr = (i===0 ? 0 : (obj.recovered - json[idx+1].recovered));
        let deathIncr = (i===0 ? 0 : (obj.death - json[idx+1].death));
        let state = (obj.state ? '' : obj.state);
        data.push({
            index: i,
            date: obj.date,
            positive: obj.positive, 
            posIncr: posIncr,
            recovered: obj.recovered,
            recovIncr: recovIncr,
            death: obj.death,
            deathIncr: deathIncr,
            state: state
        });
    }
    return data;
}

function lineChartData(json, metric) {
    let array = configData(json);
    let lineData = array.map(obj => ({x: obj.index, y: obj[metric]}));
    return lineData;
}

function date(index, json){
    let date = json[json.length-1-index].date.toString();
    date = date.substr(4,2) + "/" + date.substr(6) + "/" + date.substr(0,4);
    return date;
}
export default class USAData extends React.Component {
    state = {
        loading: true,
        //NOTE: json objects ordered from most recent date to oldest date
        json: {},
        stateJson1: {},
        stateJson2: {},
        stateJson3: {}
    };

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleChange(event) {
        try{
            const stateUrl3 = "https://covidtracking.com/api/v1/states/" + event.target.value + "/daily.json";
            const stateResponse3 = await fetch(stateUrl3);
            const stateData3 = await stateResponse3.json();
            this.setState({
                stateJson3: stateData3
            })
        } catch {
        }
      }
    
    handleSubmit(event) {
        event.preventDefault();
    }

    async componentDidMount() {
        const url = "https://covidtracking.com/api/us/daily";
        const usaResponse = await fetch(url);
        const usaData = await usaResponse.json();
        const stateUrl1 = "https://covidtracking.com/api/v1/states/ca/daily.json";
        const stateResponse1 = await fetch(stateUrl1);
        const stateData1 = await stateResponse1.json();
        const stateUrl2 = "https://covidtracking.com/api/v1/states/ny/daily.json";
        const stateResponse2 = await fetch(stateUrl2);
        const stateData2 = await stateResponse2.json();
        const stateUrl3 = "https://covidtracking.com/api/v1/states/ny/daily.json";
        const stateResponse3 = await fetch(stateUrl3);
        const stateData3 = await stateResponse3.json();
        this.setState({
            loading: false,
            json: usaData, 
            stateJson1: stateData1, 
            stateJson2: stateData2, 
            stateJson3: stateData3,
        });
    }

    render() {
        if (this.state.loading){
            return(<div>loading...</div>);
        }

        return (

        <> 
 
            

           <div style={{ display: "flex", flexWrap: "wrap", paddingLeft: '10%' }}>

            {/* Bar Chart: Change in Positive Cases of COVID-19 USA */}
            <VictoryChart
            height={400}
            width={400}
            padding={100}
            theme={VictoryTheme.material}
            animate={{
                duration: 1000
            }}
            containerComponent={
                <VictoryVoronoiContainer
                  labels={({ datum }) => 
                  `${date(datum.index, this.state.json)}: ${datum.posIncr} new case(s)`
            }
                />
              }
            style={{ parent: { maxWidth: "60%" } }}
            >
                 <VictoryLabel
                    fontSize={10}
                    x={200}
                    y={60}
                    textAnchor="middle"
                    text="USA: Number of Positive Cases over Time"
                />
                <VictoryAxis
                    style={sharedAxisStyles}
                    tickValues={[0, this.state.json.length]}
                    tickFormat={[date(0, this.state.json), date(this.state.json.length-1, this.state.json)]}
                ></VictoryAxis>
                <VictoryAxis
                    dependentAxis
                    tickFormat={(x) => (`${x / 1000}k`)}
                    label="Number of New Cases"
                    style={sharedAxisStyles}
                ></VictoryAxis>

                <VictoryBar
                    data={configData(this.state.json)}
                    x="index"
                    y="positive"          
                />
            </VictoryChart>
            
            {/* Line Chart */}
            <VictoryChart
                height={400}
                width={400}
                
                padding={100}
                theme={VictoryTheme.material}
                animate={{
                    duration: 1000
                }}
                style={{ parent: { maxWidth: "60%" } }}
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
                    { name: "Recoveries", symbol: { fill: "blue", type: "square" } },
                    { name: "Deaths", symbol: { fill: "black", type: "square" } }
                    ]}
                />
                 <VictoryLabel
                    fontSize={5}
                    x={200}
                    y={60}
                    textAnchor="middle"
                    text="USA: Daily Change in Positive Cases, Recoveries, Deaths"
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
                data={lineChartData(this.state.json, 'posIncr')}
                />
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
                </VictoryStack>
                
            </VictoryChart>


            <form style={{paddingLeft: '30%', marginBottom: '-10px'}} onSubmit={this.handleSubmit}>
                <label>
                Pick a state: &nbsp;
                <select value={this.state.value} onChange={this.handleChange}>
                    <option value="ny">NY</option>
                    <option value="ca">CA</option>
                    <option value="fl">FL</option>
                </select>
                </label>
            </form>
            <VictoryChart
            height={400}
            width={400}
            padding={100}
            animate={{
                duration: 1000
            }}
            style={{ parent: { maxWidth: "60%" } }}
            theme={VictoryTheme.material}
            >
                <VictoryLabel
                    fontSize={5}
                    x={200}
                    y={60}
                    textAnchor="middle"
                    text="Number of Positive Cases Over Time by State"
                />
                {/* <VictoryLegend 
                    orientation="vertical"
                    y={100}
                    x={305}
                    symbolSpacer={10}
                    gutter={10}
                    style={{  title: {fontSize: 8 } }}
                    data={[
                    { name: "CA", symbol: { fill: "#FF0000", type: "square" } },
                    { name: "NY", symbol: { fill: "#8B0000", type: "square" } },
                    { name: "FL", symbol: { fill: "#FF6347", type: "square" } }
                    ]}
                /> */}
                <VictoryAxis
                style={sharedAxisStyles}
                        tickValues={[0, this.state.stateJson1.length]}
                        tickFormat={[date(0, this.state.stateJson1), date(this.state.stateJson1.length-1, this.state.stateJson1)]}
                />
                <VictoryAxis
                        dependentAxis
                        tickFormat={(x) => (`${x / 1000}k`)}
                        label="Number of Positive Cases"
                        style={sharedAxisStyles}
                    ></VictoryAxis>
                <VictoryStack
                colorScale={[ "#8B0000", "#FF0000", "#FF6347"]}
                >
                    {/* <VictoryArea
                        data={lineChartData(this.state.stateJson1, 'positive')}
                        labelComponent={<VictoryLabel dy={20} textAnchor={'hi'}/>}
                    />
                    <VictoryArea
                        data={lineChartData(this.state.stateJson2, 'positive')}
                    /> */}

                    <VictoryArea
                        data={lineChartData(this.state.stateJson3, 'positive')}
                    />
                </VictoryStack>
            </VictoryChart>
            </div>
            
             </>
        );
    }
}