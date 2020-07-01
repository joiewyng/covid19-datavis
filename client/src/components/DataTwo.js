import React from 'react';
import {
    VictoryPie,
    VictoryBar,
    VictoryChart,
    VictoryPolarAxis,
    VictoryStack,
    VictoryTheme,
    VictoryGroup,
    VictoryLabel,
    VictoryTooltip,
   } from 'victory';
export default class DataTwo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            json: {},
        }
    }
    async callDB() {
        await fetch("http://localhost:9000/worldDB")
            .then(res => {
                return res.json();
            }).then(json => {
                this.setState({json: Array.from(json)});
            }).catch(err => err);
    }

    async componentDidMount() {
        await this.callDB();
        this.setState({loading: false});
        console.log(this.state.json);
        console.log(this.state.json[0]["Annual Totals"][9].Period);
    }

    render(){
        if (this.state.loading || this.state.json.length === 0){
            return(<div>loading...</div>);
        } else {
            return (
                <div className="Data2">
                    <h1 style={{marginTop: 50}}>Energy in the USA</h1>
                    <DonutChart data={this.state.json[0]["Annual Totals"]}/>
                    <HorizBarChart data={this.state.json}/>
                    <PieChart/>
                </div>
            );
        }
    }
}

let sampleDataPolar = [
    { x: 100, y: 3},
];

let sampleDataPolar2 = [
    { x: 300, y: 10},
    { x: 300, y: 5},
];

let sampleDataPolar3 = [
    { x: 10, y: 4},
];



class CustomLabel extends React.Component {
    render() {
        return (
        <g>
            {/* <VictoryLabel {...this.props}/> */}
            <VictoryTooltip
            {...this.props}
            x={200} y={275}
            orientation="top"
            pointerLength={0}
            cornerRadius={75}
            flyoutWidth={150}
            flyoutHeight={170}
            flyoutStyle={{ fill: "white", stroke:"none"}}
            style={{ labels: { fill: "black", fontSize:15} }}
            />
        </g>
        );
    }
}

CustomLabel.defaultEvents = VictoryTooltip.defaultEvents;

class DonutChart extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            year: 9,
            sum: 0
        }
        this.handleChange = this.handleChange.bind(this);
    }
    calculateSum() {
        let obj = this.props.data[this.state.year];
        let array = Object.entries(obj);
        let dataArray = array.filter((_, i) => ![0, 9, 10, 11, 12].includes(i));
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++){
            let value = dataArray[i][1];
            let parsedVal = parseFloat(value.replace(/,/g, ''));
            sum += parsedVal;
        }
        this.setState({sum: sum});
    }

    configData () {
        let obj = this.props.data[this.state.year];
        let array = Object.entries(obj);
        // tuple array with each entry containing the key and value
        let dataArray = array.filter((_, i) => ![0, 9, 10, 11, 12].includes(i));
        console.log(dataArray);
        let pieData = [];
        if (this.state.sum !== 0){
            pieData = dataArray.map(obj => 
                ({
                    x: obj[0],
                    y: parseFloat(obj[1].replace(/,/g, '')),
                    percent: (parseFloat(obj[1].replace(/,/g, ''))/this.state.sum*100).toFixed(2),
                }
                ));
        }
        return pieData;
    }

    handleChange(event){
        this.setState({year: event.target.value})
    }

    componentDidMount(){
        this.calculateSum();
        this.configData();
    }

    render() {
        return (
            <>
            <div style={{marginBottom: -20}}>
                <strong style={{lineHeight: 3, fontSize: 20}}>Net Generation from Renewable Sources</strong>
                <div>in Thousand Megawatthours</div>
                <select style={{margin: 15}}value={this.state.year} onChange={this.handleChange}>
                    <option value="0">2010</option>
                    <option value="1">2011</option>
                    <option value="2">2012</option>
                    <option value="3">2013</option>
                    <option value="4">2014</option>
                    <option value="5">2015</option>
                    <option value="6">2016</option>
                    <option value="7">2017</option>
                    <option value="8">2018</option>
                    <option value="9">2019</option>
             </select>
            </div>
            
            <div style={{marginLeft: "30%", marginRight: "30%"}}>
                <VictoryPie
                    animate={{
                        duration: 1000
                    }}
                    colorScale={["#8DC3A7", "#6BAF92", "#4E9C81", "#358873", "#207567" ]}
                    outerRadius={250}
                    innerRadius={100}
                    labelRadius={160}
                    labels={({ datum }) => `${datum.percent}% \n -------------- \n${datum.x}`}
                    style={{ labels: { fill: "black", fontSize: 10} }}
                    labelComponent={<CustomLabel />}
                    data={this.configData()}
                
                />
            </div>
            <div  style={{marginTop: -290, fontSize: 30}}>201{this.state.year}</div>
            <div style={{marginTop: 290}}></div>
            </>
        )
    }
}

class HorizBarChart extends React.Component {
    render() {
        return (
            <div style={{marginLeft: "30%", marginRight: "30%"}}>
                <VictoryChart
                theme={VictoryTheme.material}
                domain={{ y: [0.5, 5.5] }}
                >
                    <VictoryGroup horizontal
                    offset={10}
                    style={{ data: { width: 6 } }}
                    colorScale={["brown", "tomato", "gold"]}
                    >
                    <VictoryBar
                        data={[
                        { x: 1, y: 1 },
                        { x: 2, y: 2 },
                        { x: 3, y: 3 },
                        { x: 4, y: 2 },
                        { x: 5, y: 1 }
                        ]}
                    />
                    <VictoryBar
                        data={[
                        { x: 1, y: 2 },
                        { x: 2, y: 3 },
                        { x: 3, y: 4 },
                        { x: 4, y: 5 },
                        { x: 5, y: 5 }
                        ]}
                    />
                    <VictoryBar
                        data={[
                        { x: 1, y: 1 },
                        { x: 2, y: 2 },
                        { x: 3, y: 3 },
                        { x: 4, y: 4 },
                        { x: 5, y: 4 }
                        ]}
                    />
                </VictoryGroup>
                </VictoryChart>
            </div>
            
        );
    }
}

class PieChart extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <>
            <div style={{marginLeft: "30%", marginRight: "30%"}}>
                <VictoryPie
                // style={{ parent: { minWidth: "50%" }}}
                colorScale={["tomato", "orange", "gold", "cyan", "navy", "white" ]}
                data={[
                    { x: "Cats", y: 35 },
                    { x: "Dogs", y: 40 },
                    { x: "Birds", y: 55 },
                    { x: "Frogs", y: 55 },
                    { x: "Mice", y: 55 },
                    { x: "Snakes", y: 10 }
                ]}
                // data={this.configData()}
                />
            </div>
            
            
            <div style={{marginLeft: "30%", marginRight: "30%"}}>
            <VictoryBar polar
                
                data={[
                    { x: 100, y: 3 },
                    { x: 6, y: 5 },
                    { x: 50, y: 2 },
              
                ]}
                width={400} height={400}
                domain={{ x: [0, 360], y: [0, 5] }}
                style={{ data: { fill: "#c43a31", stroke: "black", strokeWidth: 2 } }}
            />
            </div>
                
            <div style={{marginLeft: "30%", marginRight: "30%"}}>
                <VictoryChart polar
                    maxDomain={{ x: 360 }}
                    height={250} width={250}
                    padding={30}
                >
                <VictoryPolarAxis dependentAxis
                    style={{
                    axis: {stroke: "none"},
                    tickLabels: { fill: "none"},
                    grid: { stroke: "grey", strokeDasharray: "4, 8" }
                    }}
                />
                <VictoryPolarAxis
                    tickValues={[0, 45, 90, 135, 180, 225, 270, 315]}
                />
                <VictoryStack
                    colorScale={["#ad1b11", "#c43a31", "#dc7a6b", "pink", "green", "blue"]}
                    style={{ data: { width: 50} }}
                >
                    <VictoryBar data={sampleDataPolar}/>
                    <VictoryBar data={sampleDataPolar2}/>
                    <VictoryBar data={sampleDataPolar3}/>
                </VictoryStack>
                </VictoryChart>
            </div>
           
            

            </>
        );
    }
}