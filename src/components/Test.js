import React from 'react';
import ReactDOM from 'react-dom';
import {VictoryChart, VictoryAxis, VictoryStack, VictoryBar, VictoryTheme} from 'victory';

const data2012 = [
    {quarter: 1, earnings: 13000, i: 100},
    {quarter: 2, earnings: 16500, i: 200},
    {quarter: 3, earnings: 14250, i: 300},
    {quarter: 4, earnings: 19000, i: 400}
  ];
  
  const data2013 = [
    {quarter: 1, earnings: 15000},
    {quarter: 2, earnings: 12500},
    {quarter: 3, earnings: 19500},
    {quarter: 4, earnings: 13000}
  ];
  
  const data2014 = [
    {quarter: 1, earnings: 11500},
    {quarter: 2, earnings: 13250},
    {quarter: 3, earnings: 20000},
    {quarter: 4, earnings: 15500}
  ];
  
  const data2015 = [
    {quarter: 1, earnings: 18000},
    {quarter: 2, earnings: 13250},
    {quarter: 3, earnings: 15000},
    {quarter: 4, earnings: 12000}
  ];

  function configData(json) {
    // console.log(json);
    const data = [];
    for (let i = json.length-1; i >= 0; i--){
        data.push({index: i, positive: json[json.length-1-i].positive, date: json[json.length-1-i].date});
    }
    // console.log(data);
    return data;
}

//   function objectToArray(json) {
//       let array = [];
//       for(let i in json){
//         let key = Object.keys(json)[i];
//         let obj = {};
//         obj[key] = json[i][key];
//         array.push(obj);
//       }
//       console.log('json' + JSON.stringify(json));

//       console.log('array' + array);
//       return array;
//   }
  
  class Test extends React.Component {

    state = {
        loading: true,
        data: {}
    };

    async componentDidMount() {
        const url = "https://covidtracking.com/api/us/daily";
        const response = await fetch(url);
        const data = await response.json();
        this.setState({loading: false, data: data});
        // console.log("????" + JSON.stringify(configData(data)));
        // objectToArray(data);
        // console.log(this.state.json[0]);
        // console.log(typeof(this.state.json));
        // allData.data = configData(data);
        // allData.length = allData.data.length;
    }
    
    render() {

      if (this.state.loading){
          return (<div>loading...</div>);
      }
        
      return (
        <VictoryChart
          domainPadding={20}
          theme={VictoryTheme.material}
        >
          <VictoryAxis
            // tickValues={Array.from({length:this.state.data.length},(v,k)=>k+1)}
            tickValues={[1, 2, 3, 4]}
            tickFormat={["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"]}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(x) => (`$${x / 1000}k`)}
          />
          <VictoryStack
          animate = {{}}
          >
            <VictoryBar
            //   data={configData(this.state.data)}
            //   x="index"
            //   y="positive"
            //   data={objectToArray(this.state.data)}
            //   x="date"
            //   y="positive"
            />
            <VictoryBar
              data={data2012}
              x="quarter"
            //   y="i"
              y="earnings"
            />
            {/* <VictoryBar
              data={data2014}
              x="quarter"
              y="earnings"
            />
            <VictoryBar
              data={data2015}
              x="quarter"
              y="earnings"
            /> */}
          </VictoryStack>
        </VictoryChart>
      )
    }
  }
  
//   ReactDOM.render(<Test/>, mountNode);

  export default Test;