import React from 'react';
import {
     VictoryChart,
     VictoryAxis, 
     VictoryBar, 
     VictoryTheme, 
     VictoryVoronoiContainer,
     VictoryLabel,
    } from 'victory';
import Manage from './Manage';

class ManageUSAData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            apiLink: '',
            apiJson: '',
            dbName: 'covidUSA',
            deleteDb: false,
            refreshChart: false
        };
    

        this.handleRefresh = this.handleRefresh.bind(this);
    }
    
    async handleRefresh(event) {
        event.preventDefault();
        await this.setState({refreshChart: true});
        let url = "http://localhost:9000/testDB?refreshUSAchart=" + this.state.refreshChart;
        await fetch(url)
        .then(function(response){
            return response.json();
        }).then(json => {
            this.props.setJson(json);
        }).catch(err => err);
    }

    componentDidMount(){
        console.log("manageData mount called")
    }

    render(){
        return (
            <div>
                <form style={{margin: 30}} onSubmit={this.handleSubmit}>
                    <button onClick={this.handleRefresh} style={{margin: 15}}>Refresh</button>
                </form>
                {/* <BubbleChartDb/> */}
            </div> 
        );
    }
}

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



function date(index, json){
    let date = json[json.length-1-index].date.toString();
    date = date.substr(4,2) + "/" + date.substr(6) + "/" + date.substr(0,4);
    return date;
}
export default class USADataDb extends React.Component {
    state = {
        loading: true,
        json: {}
    };

    constructor(props) {
        super(props);

    }

    handleJson (dataJson) {
        this.setState({
            json: dataJson,
        })
    }

    async componentDidMount() {
        this.setState({
            loading: false,
        });
    }

    render() {
        if (this.state.loading || this.state.json.length === 0){
            return(<div>loading...</div>);
        }

        return (

        <> 
       
            
            <ManageUSAData setJson={this.handleJson}/>
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
            style={{ parent: { maxWidth: "30%" } }}
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
            
            </div>
            
             </>
        );
    }
}