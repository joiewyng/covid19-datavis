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
    VictoryLegend,
    VictoryVoronoiContainer,
    VictoryAxis,
    VictoryLine,
    VictoryZoomContainer,
    VictoryBrushContainer,
    createContainer,
    VictoryArea
   } from 'victory';


const apiUrl = "http://localhost:8080"
export default class DataThree extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            json: {},
            donutYear: 9,
            donutData: {}
        }
        this.setDonutYear = this.setDonutYear.bind(this);
        this.updateDonutData = this.updateDonutData.bind(this);
        
    }
    async callDB() {
        await fetch(apiUrl + "/energyDB")
            .then(res => {
                return res.json();
            }).then(json => {
                this.setState({json: Array.from(json)});
                console.log(Array.from(json));
            }).catch(err => err);
    }

    async componentDidMount() {
        await this.callDB();
        this.setState({loading: false});
        console.log(this.state.json);
        console.log(this.state.json[0]["Annual Totals"][9].Period);
    }

    setDonutYear (year) {
        this.setState({
            donutYear: year,
        })
    }

    updateDonutData(data){
        this.setState({json:data});
    }


    render(){
        if (this.state.loading || this.state.json.length === 0){
            return(<div>loading...</div>);
        } else {
            return (
                <div className="Data2">
                    <h1 style={{marginTop: 50}}>Energy in the USA</h1>
                    <div style={{ display: "flex", flexWrap: "wrap"}}>
                        <div style={{ float: 'right'}}>
                            <DonutChart 
                                data={this.state.json[0]["Annual Totals"]} 
                                setYear={this.setDonutYear} 
                                year={this.state.donutYear}
                            />
                        </div>
                        <div style={{ float: 'right'}}>
                            <ChangeCalculator
                                year={this.state.donutYear}
                                setYear={this.setDonutYear} 
                            />
                            <MoreData 
                                year={this.state.donutYear}
                                setYear={this.setDonutYear} 
                            />
                        </div>
                    </div>
                    {/* <div style={{ }}>
                            <TempChart 
                                setYear={this.setDonutYear} 
                                year={this.state.donutYear}
                            />
                    </div> */}
                    
                    
                    <HorizBarChart data={this.state.json[1]["Year 2018"]}/>
                    {/* <PieChart/> */}
                </div>
            );
        }
    }
}

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
            sum: 0,
            // showMore: false,
        }
        this.handleChange = this.handleChange.bind(this);
    }
    calculateSum() {
        // let obj = this.props.data[this.state.year];
        let obj = this.props.data[this.props.year];
        let array = Object.entries(obj);
        let dataArray = array.filter((_, i) => !(i===0));
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++){
            let value = dataArray[i][1];
            let parsedVal = parseFloat(value.replace(/,/g, ''));
            sum += parsedVal;
        }
        this.setState({sum: sum});
        console.log("calculating sum")
    }

    configData () {
        // let obj = this.props.data[this.state.year];
        let obj = this.props.data[this.props.year];
        let array = Object.entries(obj);
        // tuple array with each entry containing the key and value
        let dataArray = array.filter((_, i) => !(i===0));
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

    async handleChange(event){
        await this.props.setYear(event.target.value);
        // await this.setState({year: event.target.value})
        this.calculateSum();

        console.log('sum in handle change: '+this.state.sum);
    }

    componentDidMount(){
        this.calculateSum();
        this.configData();
    }

    render() {
        return (
            <>
            <div style={{padding: '5%'}}>
                <select style={{margin: 15, marginLeft: 130, padding:10, fontSize:18}} value={this.props.year} onChange={this.handleChange}>
                    {[0,1,2,3,4,5,6,7,8,9].map((num, index) => {
                        return <option value={num} key={index}>201{num}</option>
                    })}
                </select>
                <div style={{marginBottom: -30, marginLeft: 130}}>
                    <strong style={{lineHeight: 3, fontSize: 20}}>Net Generation from Renewable Sources</strong>
                    <div>MWh = Megawatthours</div>
                </div>
    
                <div style={{width: 650, marginLeft: '5%'}}>
                    <VictoryPie
                        animate={{
                            duration: 1000
                        }}
                        colorScale={["#8DC3A7", "#6BAF92", "#4E9C81", "#358873", "#207567" ]}
                        // colorScale={['#70c066', '#369946', '#d1e7c5',"#6BAF92", "#358873", ]}
                        outerRadius={250}
                        innerRadius={100}
                        labelRadius={160}
                        labels={({ datum }) => `${datum.percent}% \n -------------- \n${datum.x} \n -------------- \n${datum.y}K MWh `}
                        style={{ labels: { fill: "black", fontSize: 10} }}
                        labelComponent={<CustomLabel />}
                        data={this.configData()}
                    />
                    <div  style={{marginTop: "-55%", fontSize: 33}}>201{this.props.year}</div>
                </div>
                
                <div style={{marginTop: "45%"}}></div> 
            </div>
            
            </>
        )
    }
}

const years = ['\'10', '\'11', '\'12', '\'13', '\'14', '\'15', '\'16', '\'17', '\'18', '\'19'];
const petroleumLiquidsData = [23337, 16086, 13403, 13820, 18276, 17372, 13008, 12414, 16245, 11576];  
const hevSales = [274.648, 266.501, 434.648, 495.535, 452.172, 384.400, 346.949, 362.868, 343.219, 400.746];
const pevSales = [null, 17.763, 53.171, 97.102, 118.882, 114.023, 159.616, 195.581, 361.315, 326.644];
const co2Emissions = [5585, 5446, 5229, 5356, 5413, 5263, 5170, 5130, 5269, null]

class ChangeCalculator extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            from: 2010,
            to: this.props.year
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = prop => (event) => {
        this.setState({
            [prop]: event.target.value,
        });
        if (prop === 'to'){
            this.props.setYear(event.target.value) 
        }
    }

    sumData (data1, data2) {
        let data = [];
        for (let i = 0; i < data1.length; i++){
            data.push(data1[i]+data2[i]);
        }
        return data;
    }

    fontColor(greenPos, data){
        // if (greenPos){
        //     return data[this.state.to%10] - data[this.state.from%10] > 0 ? 'green' : 'red';
        // } else {
        //     return data[this.state.to%10] - data[this.state.from%10] > 0 ? 'red' : 'green';
        // }
        return 'orange';
    }

    render(){
        return(
            <div> 
                <div style={{marginTop: 40, marginLeft: -40}}>
                    Percent Change: 
                    <select style={{margin: 15, padding:7, fontSize:15}} value={this.state.from} onChange={this.handleChange('from')}>
                        {[0,1,2,3,4,5,6,7,8,9].map((num, index) => {
                            return <option value={num} key={index}>201{num}</option>
                        })}
                    </select>
                    <text style={{fontSize: 25}}>&#8594;</text>
                    <select style={{margin: 15, padding:7, fontSize:15}} value={this.state.to} onChange={this.handleChange('to')}>
                        {[0,1,2,3,4,5,6,7,8,9].map((num, index) => {
                            return <option value={num} key={index}>201{num}</option>
                        })}
                    </select>
                </div>
                
                <div style={{display: 'float', flexWrap: 'wrap', marginLeft: 100, paddingLeft: 40, paddingRight: 100, marginTop: 50,}}>
                <div style={{float: 'right', fontSize: 13, marginTop: -20, marginRight: 265}}>HEV and PEV Sales </div>
                    <div style={{backgroundColor: '#f2f3f4', padding:30, width: '35%', float: 'right', marginRight: 30}}>
                        <strong style={{color: this.fontColor(true, this.sumData(pevSales, hevSales)), fontSize: 30}}>
                        {((((hevSales[this.state.to%10]+pevSales[this.state.to%10]) - (hevSales[this.state.from%10]+pevSales[this.state.from%10])))/(hevSales[this.state.from%10]+pevSales[this.state.from%10])*100).toFixed(2) > 0 ? '+' : ''} 
                            {((((hevSales[this.state.to%10]+pevSales[this.state.to%10]) - (hevSales[this.state.from%10]+pevSales[this.state.from%10])))/(hevSales[this.state.from%10]+pevSales[this.state.from%10])*100).toFixed(2)} %
                        </strong>
                        <div style={{fontSize: 13, marginTop: 10}}>{(hevSales[this.state.from%10]+pevSales[this.state.from%10]).toFixed(2)}K sales &#8594; {(hevSales[this.state.to%10]+pevSales[this.state.to%10]).toFixed(2)}K sales</div>
                    </div>
                    <div style={{float: 'left', fontSize: 13, marginTop: -20}}>Petroleum Liquids Generation </div>
                    <div style={{backgroundColor: '#f2f3f4', padding:30, width: '35%'}}>
                        <strong style={{color: this.fontColor(false, petroleumLiquidsData), fontSize: 30}}>
                            {((petroleumLiquidsData[this.state.to%10] - petroleumLiquidsData[this.state.from%10])/petroleumLiquidsData[this.state.from%10]*100).toFixed(2) > 0 ? '+' : ''} 
                            {((petroleumLiquidsData[this.state.to%10] - petroleumLiquidsData[this.state.from%10])/petroleumLiquidsData[this.state.from%10]*100).toFixed(2)} %
                        </strong>
                        <div style={{fontSize: 13, marginTop: 10}}>{petroleumLiquidsData[this.state.from%10]}K MWh &#8594; {petroleumLiquidsData[this.state.to%10]}K MWh</div>
                    </div>
                </div>
            </div>
        );
    }
}

class MoreData extends React.Component {
    
    constructor(props){
        super(props);
    }

    formatData(x, y, category, highlight, fill){
        let data = [];
        for (let i = 0; i < x.length; i++){
            data.push({
                x: x[i],
                y: y[i],
                category: category,
                fill: String(this.props.year) === x[i].substring(2,3) ? highlight : fill
            })
        }
        console.log(this.props.year);
        console.log(data);
        return data;
    }
    
    render(){
        return ( <>
            <div style={{display: "flex", flexWrap: "wrap", width: '100%', padding: '10%'}}>
                <div style={{minWidth: '20%'}}>
                    <div><strong> Net Generation of Petroleum Liquids</strong></div>
                    <div> in Thousand Megawatthours</div>
                    <VictoryChart height={300} width={400}
                        animate={{
                            duration: 500
                        }}
                        domainPadding={{ x: 50, y: [0, 20] }}
                        containerComponent={
                            <VictoryVoronoiContainer
                            style={{padding: 10}}
                            labels={({ datum }) => 
                                datum.y > 0 ? `  ${datum.y} MWh` : null
                            } 
                            />
                        }
                    >
                        <VictoryBar
                            barWidth={20}
                            padding={{ left: 20, right: 60 }}
                            style={{data:{
                                fill: ({ datum }) => datum.fill,
                            }}}
                            data={this.formatData(years, petroleumLiquidsData, null, 'tomato', 'gray')}
                            events={[{
                                target: 'data',
                                eventHandlers: {
                                    onClick: (event, data) => {
                                        this.props.setYear(Number(data.datum.x.substring(2,3)))
                                    },
                                },
                            }]}
                        />
                    </VictoryChart>
                </div>
                <div style={{minWidth: '20%'}}>
                    <div><strong> Hybrid Electric Vehicle and Plug-In Electric Vehicle Sales</strong></div>
                    <div>in Thousands</div>
                    <VictoryChart height={300} width={400}
                        animate={{
                            duration: 500
                        }}
                        domainPadding={{ x: 50, y: [0, 20] }}
                        containerComponent={
                            <VictoryVoronoiContainer
                            style={{padding: 10}}
                            labels={({ datum }) => 
                                datum.y > 0 ? `  ${datum.y}K ${datum.category} sales` : null
                            } 
                            />
                        }
                    >
                    <VictoryStack offset={20} style={{ data: { width: 50 } }}>
                        <VictoryBar
                            barWidth={20}
                            padding={{ left: 20, right: 60 }}
                            style={{data:{
                                fill: ({ datum }) => datum.fill,
                            }}}
                            data={this.formatData(years, hevSales, 'HEV', '#8DC3A7', '#909090')}
                            events={[{
                                target: 'data',
                                eventHandlers: {
                                    onClick: (event, data) => {
                                        this.props.setYear(Number(data.datum.x.substring(2,3)))
                                    },
                                },
                            }]}
                        />
                        <VictoryBar
                            barWidth={20}
                            padding={{ left: 20, right: 60 }}
                            style={{data:{
                                fill: ({ datum }) => datum.fill,
                            }}}
                            data={this.formatData(years, pevSales, 'PEV', '#4E9C81', '#525252')}
                            events={[{
                                target: 'data',
                                eventHandlers: {
                                    onClick: (event, data) => {
                                        this.props.setYear(Number(data.datum.x.substring(2,3)))
                                    },
                                },
                            }]}
                        />
                        </VictoryStack>
                    
                    </VictoryChart>
                </div>
                
            </div>
            {/* <div style={{width: '60%', marginLeft: '20%'}}>
                <div><strong>Energy-related carbon dioxide emissions</strong></div>
                <div>in million metric tons of CO2</div>
                <VictoryChart
                    theme={VictoryTheme.material}
                    domainPadding={{ x: 0, y: [-80, 20] }}
                    height={200} width={300}
                    containerComponent={
                        <VictoryVoronoiContainer
                        style={{padding: 10}}
                        labels={({ datum }) => 
                            datum.y > 0 ? `  ${datum.y} million metric tons` : null
                        } 
                        />
                    }
                >
                    <VictoryLine
                    style={{
                    data: { stroke: "#c43a31" },
                    parent: { border: "1px solid #ccc"}
                    }}
                    data={this.formatData(years, co2Emissions)}
                    />
                </VictoryChart>
            </div> */}
        </>
        );
    }
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
const airTempData = 
[
    {
      "Month": 197901,
      "global": -0.2309
    },
    {
      "Month": 197902,
      "global": -0.4906
    },
    {
      "Month": 197903,
      "global": -0.2922
    },
    {
      "Month": 197904,
      "global": -0.3259
    },
    {
      "Month": 197905,
      "global": -0.2858
    },
    {
      "Month": 197906,
      "global": -0.258
    },
    {
      "Month": 197907,
      "global": -0.3306
    },
    {
      "Month": 197908,
      "global": -0.2336
    },
    {
      "Month": 197909,
      "global": -0.1801
    },
    {
      "Month": 197910,
      "global": -0.1248
    },
    {
      "Month": 197911,
      "global": -0.147
    },
    {
      "Month": 197912,
      "global": 0.0667
    },
    {
      "Month": 198001,
      "global": -0.1084
    },
    {
      "Month": 198002,
      "global": -0.0513
    },
    {
      "Month": 198003,
      "global": -0.0826
    },
    {
      "Month": 198004,
      "global": -0.0015
    },
    {
      "Month": 198005,
      "global": 0.0697
    },
    {
      "Month": 198006,
      "global": -0.0799
    },
    {
      "Month": 198007,
      "global": -0.0425
    },
    {
      "Month": 198008,
      "global": -0.1085
    },
    {
      "Month": 198009,
      "global": -0.1715
    },
    {
      "Month": 198010,
      "global": -0.216
    },
    {
      "Month": 198011,
      "global": -0.192
    },
    {
      "Month": 198012,
      "global": -0.2736
    },
    {
      "Month": 198101,
      "global": 0.0171
    },
    {
      "Month": 198102,
      "global": -0.0524
    },
    {
      "Month": 198103,
      "global": 0.0305
    },
    {
      "Month": 198104,
      "global": -0.0305
    },
    {
      "Month": 198105,
      "global": -0.069
    },
    {
      "Month": 198106,
      "global": -0.0755
    },
    {
      "Month": 198107,
      "global": -0.0747
    },
    {
      "Month": 198108,
      "global": -0.0603
    },
    {
      "Month": 198109,
      "global": -0.1398
    },
    {
      "Month": 198110,
      "global": -0.1792
    },
    {
      "Month": 198111,
      "global": -0.1878
    },
    {
      "Month": 198112,
      "global": -0.0359
    },
    {
      "Month": 198201,
      "global": -0.3861
    },
    {
      "Month": 198202,
      "global": -0.2909
    },
    {
      "Month": 198203,
      "global": -0.4431
    },
    {
      "Month": 198204,
      "global": -0.3551
    },
    {
      "Month": 198205,
      "global": -0.2111
    },
    {
      "Month": 198206,
      "global": -0.2463
    },
    {
      "Month": 198207,
      "global": -0.1711
    },
    {
      "Month": 198208,
      "global": -0.2779
    },
    {
      "Month": 198209,
      "global": -0.2693
    },
    {
      "Month": 198210,
      "global": -0.2803
    },
    {
      "Month": 198211,
      "global": -0.2834
    },
    {
      "Month": 198212,
      "global": -0.0342
    },
    {
      "Month": 198301,
      "global": 0.0396
    },
    {
      "Month": 198302,
      "global": 0.004
    },
    {
      "Month": 198303,
      "global": 0.006
    },
    {
      "Month": 198304,
      "global": -0.0941
    },
    {
      "Month": 198305,
      "global": 0.0277
    },
    {
      "Month": 198306,
      "global": -0.092
    },
    {
      "Month": 198307,
      "global": -0.1496
    },
    {
      "Month": 198308,
      "global": -0.0738
    },
    {
      "Month": 198309,
      "global": -0.0007
    },
    {
      "Month": 198310,
      "global": -0.2356
    },
    {
      "Month": 198311,
      "global": -0.1167
    },
    {
      "Month": 198312,
      "global": -0.2251
    },
    {
      "Month": 198401,
      "global": -0.2111
    },
    {
      "Month": 198402,
      "global": -0.3605
    },
    {
      "Month": 198403,
      "global": -0.1985
    },
    {
      "Month": 198404,
      "global": -0.2865
    },
    {
      "Month": 198405,
      "global": -0.0539
    },
    {
      "Month": 198406,
      "global": -0.3321
    },
    {
      "Month": 198407,
      "global": -0.3649
    },
    {
      "Month": 198408,
      "global": -0.2626
    },
    {
      "Month": 198409,
      "global": -0.2898
    },
    {
      "Month": 198410,
      "global": -0.2823
    },
    {
      "Month": 198411,
      "global": -0.4153
    },
    {
      "Month": 198412,
      "global": -0.4044
    },
    {
      "Month": 198501,
      "global": -0.2315
    },
    {
      "Month": 198502,
      "global": -0.4976
    },
    {
      "Month": 198503,
      "global": -0.3365
    },
    {
      "Month": 198504,
      "global": -0.2901
    },
    {
      "Month": 198505,
      "global": -0.276
    },
    {
      "Month": 198506,
      "global": -0.2926
    },
    {
      "Month": 198507,
      "global": -0.3687
    },
    {
      "Month": 198508,
      "global": -0.2183
    },
    {
      "Month": 198509,
      "global": -0.3246
    },
    {
      "Month": 198510,
      "global": -0.4071
    },
    {
      "Month": 198511,
      "global": -0.3566
    },
    {
      "Month": 198512,
      "global": -0.3469
    },
    {
      "Month": 198601,
      "global": -0.2416
    },
    {
      "Month": 198602,
      "global": -0.1812
    },
    {
      "Month": 198603,
      "global": -0.2186
    },
    {
      "Month": 198604,
      "global": -0.1174
    },
    {
      "Month": 198605,
      "global": -0.1084
    },
    {
      "Month": 198606,
      "global": -0.2742
    },
    {
      "Month": 198607,
      "global": -0.2816
    },
    {
      "Month": 198608,
      "global": -0.2613
    },
    {
      "Month": 198609,
      "global": -0.3307
    },
    {
      "Month": 198610,
      "global": -0.3542
    },
    {
      "Month": 198611,
      "global": -0.264
    },
    {
      "Month": 198612,
      "global": -0.2482
    },
    {
      "Month": 198701,
      "global": -0.1421
    },
    {
      "Month": 198702,
      "global": -0.092
    },
    {
      "Month": 198703,
      "global": -0.2871
    },
    {
      "Month": 198704,
      "global": -0.1516
    },
    {
      "Month": 198705,
      "global": -0.1118
    },
    {
      "Month": 198706,
      "global": -0.0174
    },
    {
      "Month": 198707,
      "global": 0.0778
    },
    {
      "Month": 198708,
      "global": -0.0949
    },
    {
      "Month": 198709,
      "global": -0.0279
    },
    {
      "Month": 198710,
      "global": -0.1066
    },
    {
      "Month": 198711,
      "global": -0.1359
    },
    {
      "Month": 198712,
      "global": 0.0729
    },
    {
      "Month": 198801,
      "global": 0.0599
    },
    {
      "Month": 198802,
      "global": -0.136
    },
    {
      "Month": 198803,
      "global": 0.0022
    },
    {
      "Month": 198804,
      "global": -0.0064
    },
    {
      "Month": 198805,
      "global": 0.0585
    },
    {
      "Month": 198806,
      "global": 0.017
    },
    {
      "Month": 198807,
      "global": -0.0303
    },
    {
      "Month": 198808,
      "global": 0.0094
    },
    {
      "Month": 198809,
      "global": 0.0089
    },
    {
      "Month": 198810,
      "global": -0.1119
    },
    {
      "Month": 198811,
      "global": -0.3316
    },
    {
      "Month": 198812,
      "global": -0.1708
    },
    {
      "Month": 198901,
      "global": -0.4052
    },
    {
      "Month": 198902,
      "global": -0.1396
    },
    {
      "Month": 198903,
      "global": -0.1631
    },
    {
      "Month": 198904,
      "global": -0.1324
    },
    {
      "Month": 198905,
      "global": -0.2464
    },
    {
      "Month": 198906,
      "global": -0.2324
    },
    {
      "Month": 198907,
      "global": -0.0708
    },
    {
      "Month": 198908,
      "global": -0.1457
    },
    {
      "Month": 198909,
      "global": -0.0867
    },
    {
      "Month": 198910,
      "global": -0.1352
    },
    {
      "Month": 198911,
      "global": -0.2527
    },
    {
      "Month": 198912,
      "global": -0.041
    },
    {
      "Month": 199001,
      "global": -0.0391
    },
    {
      "Month": 199002,
      "global": -0.0777
    },
    {
      "Month": 199003,
      "global": 0.2671
    },
    {
      "Month": 199004,
      "global": 0.1302
    },
    {
      "Month": 199005,
      "global": 0.1443
    },
    {
      "Month": 199006,
      "global": -0.0106
    },
    {
      "Month": 199007,
      "global": 0.0889
    },
    {
      "Month": 199008,
      "global": 0.0098
    },
    {
      "Month": 199009,
      "global": -0.0343
    },
    {
      "Month": 199010,
      "global": 0.0814
    },
    {
      "Month": 199011,
      "global": 0.1168
    },
    {
      "Month": 199012,
      "global": 0.0494
    },
    {
      "Month": 199101,
      "global": 0.0252
    },
    {
      "Month": 199102,
      "global": 0.0746
    },
    {
      "Month": 199103,
      "global": -0.0587
    },
    {
      "Month": 199104,
      "global": 0.0598
    },
    {
      "Month": 199105,
      "global": -0.0158
    },
    {
      "Month": 199106,
      "global": 0.2017
    },
    {
      "Month": 199107,
      "global": 0.1192
    },
    {
      "Month": 199108,
      "global": 0.0362
    },
    {
      "Month": 199109,
      "global": -0.0056
    },
    {
      "Month": 199110,
      "global": -0.1087
    },
    {
      "Month": 199111,
      "global": -0.1209
    },
    {
      "Month": 199112,
      "global": -0.1381
    },
    {
      "Month": 199201,
      "global": -0.0193
    },
    {
      "Month": 199202,
      "global": -0.0535
    },
    {
      "Month": 199203,
      "global": -0.0529
    },
    {
      "Month": 199204,
      "global": -0.237
    },
    {
      "Month": 199205,
      "global": -0.1777
    },
    {
      "Month": 199206,
      "global": -0.1489
    },
    {
      "Month": 199207,
      "global": -0.2948
    },
    {
      "Month": 199208,
      "global": -0.3124
    },
    {
      "Month": 199209,
      "global": -0.4129
    },
    {
      "Month": 199210,
      "global": -0.3618
    },
    {
      "Month": 199211,
      "global": -0.3805
    },
    {
      "Month": 199212,
      "global": -0.2644
    },
    {
      "Month": 199301,
      "global": -0.1167
    },
    {
      "Month": 199302,
      "global": -0.1113
    },
    {
      "Month": 199303,
      "global": -0.1695
    },
    {
      "Month": 199304,
      "global": -0.1434
    },
    {
      "Month": 199305,
      "global": -0.1343
    },
    {
      "Month": 199306,
      "global": -0.1288
    },
    {
      "Month": 199307,
      "global": -0.1836
    },
    {
      "Month": 199308,
      "global": -0.2087
    },
    {
      "Month": 199309,
      "global": -0.3204
    },
    {
      "Month": 199310,
      "global": -0.1906
    },
    {
      "Month": 199311,
      "global": -0.3052
    },
    {
      "Month": 199312,
      "global": -0.154
    },
    {
      "Month": 199401,
      "global": -0.2047
    },
    {
      "Month": 199402,
      "global": -0.4391
    },
    {
      "Month": 199403,
      "global": -0.2242
    },
    {
      "Month": 199404,
      "global": -0.0979
    },
    {
      "Month": 199405,
      "global": -0.1875
    },
    {
      "Month": 199406,
      "global": -0.0802
    },
    {
      "Month": 199407,
      "global": -0.1083
    },
    {
      "Month": 199408,
      "global": -0.2086
    },
    {
      "Month": 199409,
      "global": -0.0425
    },
    {
      "Month": 199410,
      "global": -0.0524
    },
    {
      "Month": 199411,
      "global": -0.012
    },
    {
      "Month": 199412,
      "global": -0.0731
    },
    {
      "Month": 199501,
      "global": 0.0619
    },
    {
      "Month": 199502,
      "global": 0.2626
    },
    {
      "Month": 199503,
      "global": -0.0415
    },
    {
      "Month": 199504,
      "global": 0.0632
    },
    {
      "Month": 199505,
      "global": -0.0742
    },
    {
      "Month": 199506,
      "global": 0.0877
    },
    {
      "Month": 199507,
      "global": 0.0624
    },
    {
      "Month": 199508,
      "global": 0.0688
    },
    {
      "Month": 199509,
      "global": -0.0044
    },
    {
      "Month": 199510,
      "global": 0.0447
    },
    {
      "Month": 199511,
      "global": 0.0131
    },
    {
      "Month": 199512,
      "global": -0.1416
    },
    {
      "Month": 199601,
      "global": -0.1686
    },
    {
      "Month": 199602,
      "global": -0.0248
    },
    {
      "Month": 199603,
      "global": -0.1161
    },
    {
      "Month": 199604,
      "global": -0.1619
    },
    {
      "Month": 199605,
      "global": -0.2063
    },
    {
      "Month": 199606,
      "global": -0.142
    },
    {
      "Month": 199607,
      "global": -0.04
    },
    {
      "Month": 199608,
      "global": 0.0642
    },
    {
      "Month": 199609,
      "global": -0.1313
    },
    {
      "Month": 199610,
      "global": -0.2007
    },
    {
      "Month": 199611,
      "global": 0.0178
    },
    {
      "Month": 199612,
      "global": -0.0471
    },
    {
      "Month": 199701,
      "global": -0.1784
    },
    {
      "Month": 199702,
      "global": -0.1172
    },
    {
      "Month": 199703,
      "global": 0.024
    },
    {
      "Month": 199704,
      "global": -0.1454
    },
    {
      "Month": 199705,
      "global": -0.0915
    },
    {
      "Month": 199706,
      "global": 0.0938
    },
    {
      "Month": 199707,
      "global": -0.0057
    },
    {
      "Month": 199708,
      "global": 0.0417
    },
    {
      "Month": 199709,
      "global": 0.1316
    },
    {
      "Month": 199710,
      "global": 0.1868
    },
    {
      "Month": 199711,
      "global": 0.2191
    },
    {
      "Month": 199712,
      "global": 0.151
    },
    {
      "Month": 199801,
      "global": 0.143
    },
    {
      "Month": 199802,
      "global": 0.3514
    },
    {
      "Month": 199803,
      "global": 0.1589
    },
    {
      "Month": 199804,
      "global": 0.3034
    },
    {
      "Month": 199805,
      "global": 0.3391
    },
    {
      "Month": 199806,
      "global": 0.357
    },
    {
      "Month": 199807,
      "global": 0.2881
    },
    {
      "Month": 199808,
      "global": 0.3172
    },
    {
      "Month": 199809,
      "global": 0.1434
    },
    {
      "Month": 199810,
      "global": 0.062
    },
    {
      "Month": 199811,
      "global": -0.0017
    },
    {
      "Month": 199812,
      "global": 0.1115
    },
    {
      "Month": 199901,
      "global": -0.036
    },
    {
      "Month": 199902,
      "global": 0.1493
    },
    {
      "Month": 199903,
      "global": -0.1965
    },
    {
      "Month": 199904,
      "global": -0.121
    },
    {
      "Month": 199905,
      "global": -0.1364
    },
    {
      "Month": 199906,
      "global": -0.0584
    },
    {
      "Month": 199907,
      "global": -0.0356
    },
    {
      "Month": 199908,
      "global": -0.0618
    },
    {
      "Month": 199909,
      "global": -0.0044
    },
    {
      "Month": 199910,
      "global": -0.0617
    },
    {
      "Month": 199911,
      "global": -0.0657
    },
    {
      "Month": 199912,
      "global": -0.0247
    },
    {
      "Month": 200001,
      "global": -0.1986
    },
    {
      "Month": 200002,
      "global": 0.0608
    },
    {
      "Month": 200003,
      "global": -0.0243
    },
    {
      "Month": 200004,
      "global": 0.0999
    },
    {
      "Month": 200005,
      "global": -0.0597
    },
    {
      "Month": 200006,
      "global": -0.0701
    },
    {
      "Month": 200007,
      "global": -0.0714
    },
    {
      "Month": 200008,
      "global": 0.0007
    },
    {
      "Month": 200009,
      "global": -0.0425
    },
    {
      "Month": 200010,
      "global": -0.1561
    },
    {
      "Month": 200011,
      "global": -0.1091
    },
    {
      "Month": 200012,
      "global": -0.1434
    },
    {
      "Month": 200101,
      "global": -0.0388
    },
    {
      "Month": 200102,
      "global": -0.0855
    },
    {
      "Month": 200103,
      "global": 0.0351
    },
    {
      "Month": 200104,
      "global": 0.0292
    },
    {
      "Month": 200105,
      "global": 0.1151
    },
    {
      "Month": 200106,
      "global": 0.0628
    },
    {
      "Month": 200107,
      "global": 0.1458
    },
    {
      "Month": 200108,
      "global": 0.1248
    },
    {
      "Month": 200109,
      "global": 0.1181
    },
    {
      "Month": 200110,
      "global": 0.1336
    },
    {
      "Month": 200111,
      "global": 0.3371
    },
    {
      "Month": 200112,
      "global": 0.229
    },
    {
      "Month": 200201,
      "global": 0.2862
    },
    {
      "Month": 200202,
      "global": 0.1891
    },
    {
      "Month": 200203,
      "global": 0.3853
    },
    {
      "Month": 200204,
      "global": 0.1189
    },
    {
      "Month": 200205,
      "global": 0.2409
    },
    {
      "Month": 200206,
      "global": 0.197
    },
    {
      "Month": 200207,
      "global": 0.2003
    },
    {
      "Month": 200208,
      "global": 0.1291
    },
    {
      "Month": 200209,
      "global": 0.2015
    },
    {
      "Month": 200210,
      "global": 0.1587
    },
    {
      "Month": 200211,
      "global": 0.1827
    },
    {
      "Month": 200212,
      "global": 0.0767
    },
    {
      "Month": 200301,
      "global": 0.2975
    },
    {
      "Month": 200302,
      "global": 0.1098
    },
    {
      "Month": 200303,
      "global": 0.0283
    },
    {
      "Month": 200304,
      "global": 0.0625
    },
    {
      "Month": 200305,
      "global": 0.1472
    },
    {
      "Month": 200306,
      "global": 0.035
    },
    {
      "Month": 200307,
      "global": 0.1191
    },
    {
      "Month": 200308,
      "global": 0.2217
    },
    {
      "Month": 200309,
      "global": 0.27
    },
    {
      "Month": 200310,
      "global": 0.3437
    },
    {
      "Month": 200311,
      "global": 0.1999
    },
    {
      "Month": 200312,
      "global": 0.3762
    },
    {
      "Month": 200401,
      "global": 0.1492
    },
    {
      "Month": 200402,
      "global": 0.2243
    },
    {
      "Month": 200403,
      "global": 0.1831
    },
    {
      "Month": 200404,
      "global": 0.1682
    },
    {
      "Month": 200405,
      "global": -0.0494
    },
    {
      "Month": 200406,
      "global": 0.0804
    },
    {
      "Month": 200407,
      "global": -0.1095
    },
    {
      "Month": 200408,
      "global": 0.0141
    },
    {
      "Month": 200409,
      "global": 0.1562
    },
    {
      "Month": 200410,
      "global": 0.2464
    },
    {
      "Month": 200411,
      "global": 0.3085
    },
    {
      "Month": 200412,
      "global": 0.1032
    },
    {
      "Month": 200501,
      "global": 0.3385
    },
    {
      "Month": 200502,
      "global": 0.2033
    },
    {
      "Month": 200503,
      "global": 0.2828
    },
    {
      "Month": 200504,
      "global": 0.2531
    },
    {
      "Month": 200505,
      "global": 0.2305
    },
    {
      "Month": 200506,
      "global": 0.2503
    },
    {
      "Month": 200507,
      "global": 0.2517
    },
    {
      "Month": 200508,
      "global": 0.2053
    },
    {
      "Month": 200509,
      "global": 0.3259
    },
    {
      "Month": 200510,
      "global": 0.4115
    },
    {
      "Month": 200511,
      "global": 0.3688
    },
    {
      "Month": 200512,
      "global": 0.3
    },
    {
      "Month": 200601,
      "global": 0.1472
    },
    {
      "Month": 200602,
      "global": 0.2867
    },
    {
      "Month": 200603,
      "global": 0.1829
    },
    {
      "Month": 200604,
      "global": 0.1127
    },
    {
      "Month": 200605,
      "global": 0.0892
    },
    {
      "Month": 200606,
      "global": 0.255
    },
    {
      "Month": 200607,
      "global": 0.1697
    },
    {
      "Month": 200608,
      "global": 0.2467
    },
    {
      "Month": 200609,
      "global": 0.2443
    },
    {
      "Month": 200610,
      "global": 0.3775
    },
    {
      "Month": 200611,
      "global": 0.3384
    },
    {
      "Month": 200612,
      "global": 0.3942
    },
    {
      "Month": 200701,
      "global": 0.5542
    },
    {
      "Month": 200702,
      "global": 0.2852
    },
    {
      "Month": 200703,
      "global": 0.195
    },
    {
      "Month": 200704,
      "global": 0.3563
    },
    {
      "Month": 200705,
      "global": 0.2448
    },
    {
      "Month": 200706,
      "global": 0.15
    },
    {
      "Month": 200707,
      "global": 0.1727
    },
    {
      "Month": 200708,
      "global": 0.157
    },
    {
      "Month": 200709,
      "global": 0.1064
    },
    {
      "Month": 200710,
      "global": 0.2256
    },
    {
      "Month": 200711,
      "global": 0.1986
    },
    {
      "Month": 200712,
      "global": 0.1096
    },
    {
      "Month": 200801,
      "global": -0.1371
    },
    {
      "Month": 200802,
      "global": -0.1236
    },
    {
      "Month": 200803,
      "global": 0.2131
    },
    {
      "Month": 200804,
      "global": 0.0559
    },
    {
      "Month": 200805,
      "global": 0.0557
    },
    {
      "Month": 200806,
      "global": -0.0246
    },
    {
      "Month": 200807,
      "global": 0.1429
    },
    {
      "Month": 200808,
      "global": 0.0967
    },
    {
      "Month": 200809,
      "global": 0.1662
    },
    {
      "Month": 200810,
      "global": 0.2767
    },
    {
      "Month": 200811,
      "global": 0.2888
    },
    {
      "Month": 200812,
      "global": 0.1549
    },
    {
      "Month": 200901,
      "global": 0.2507
    },
    {
      "Month": 200902,
      "global": 0.1625
    },
    {
      "Month": 200903,
      "global": 0.0731
    },
    {
      "Month": 200904,
      "global": 0.1225
    },
    {
      "Month": 200905,
      "global": 0.1569
    },
    {
      "Month": 200906,
      "global": 0.1782
    },
    {
      "Month": 200907,
      "global": 0.304
    },
    {
      "Month": 200908,
      "global": 0.2209
    },
    {
      "Month": 200909,
      "global": 0.3
    },
    {
      "Month": 200910,
      "global": 0.3196
    },
    {
      "Month": 200911,
      "global": 0.3783
    },
    {
      "Month": 200912,
      "global": 0.2669
    },
    {
      "Month": 201001,
      "global": 0.3847
    },
    {
      "Month": 201002,
      "global": 0.4194
    },
    {
      "Month": 201003,
      "global": 0.4633
    },
    {
      "Month": 201004,
      "global": 0.435
    },
    {
      "Month": 201005,
      "global": 0.3593
    },
    {
      "Month": 201006,
      "global": 0.2604
    },
    {
      "Month": 201007,
      "global": 0.2182
    },
    {
      "Month": 201008,
      "global": 0.2218
    },
    {
      "Month": 201009,
      "global": 0.2953
    },
    {
      "Month": 201010,
      "global": 0.356
    },
    {
      "Month": 201011,
      "global": 0.3712
    },
    {
      "Month": 201012,
      "global": 0.0971
    },
    {
      "Month": 201101,
      "global": 0.1006
    },
    {
      "Month": 201102,
      "global": 0.0213
    },
    {
      "Month": 201103,
      "global": 0.1357
    },
    {
      "Month": 201104,
      "global": 0.1962
    },
    {
      "Month": 201105,
      "global": 0.1192
    },
    {
      "Month": 201106,
      "global": 0.1943
    },
    {
      "Month": 201107,
      "global": 0.3094
    },
    {
      "Month": 201108,
      "global": 0.2865
    },
    {
      "Month": 201109,
      "global": 0.2436
    },
    {
      "Month": 201110,
      "global": 0.2692
    },
    {
      "Month": 201111,
      "global": 0.1428
    },
    {
      "Month": 201112,
      "global": 0.1609
    },
    {
      "Month": 201201,
      "global": 0.0255
    },
    {
      "Month": 201202,
      "global": 0.0183
    },
    {
      "Month": 201203,
      "global": 0.0581
    },
    {
      "Month": 201204,
      "global": 0.2369
    },
    {
      "Month": 201205,
      "global": 0.3344
    },
    {
      "Month": 201206,
      "global": 0.2933
    },
    {
      "Month": 201207,
      "global": 0.2066
    },
    {
      "Month": 201208,
      "global": 0.2521
    },
    {
      "Month": 201209,
      "global": 0.3091
    },
    {
      "Month": 201210,
      "global": 0.4587
    },
    {
      "Month": 201211,
      "global": 0.4333
    },
    {
      "Month": 201212,
      "global": 0.1667
    },
    {
      "Month": 201301,
      "global": 0.3378
    },
    {
      "Month": 201302,
      "global": 0.2129
    },
    {
      "Month": 201303,
      "global": 0.2182
    },
    {
      "Month": 201304,
      "global": 0.1461
    },
    {
      "Month": 201305,
      "global": 0.1823
    },
    {
      "Month": 201306,
      "global": 0.2813
    },
    {
      "Month": 201307,
      "global": 0.1413
    },
    {
      "Month": 201308,
      "global": 0.2304
    },
    {
      "Month": 201309,
      "global": 0.3659
    },
    {
      "Month": 201310,
      "global": 0.291
    },
    {
      "Month": 201311,
      "global": 0.3871
    },
    {
      "Month": 201312,
      "global": 0.3255
    },
    {
      "Month": 201401,
      "global": 0.318
    },
    {
      "Month": 201402,
      "global": 0.1015
    },
    {
      "Month": 201403,
      "global": 0.2849
    },
    {
      "Month": 201404,
      "global": 0.2921
    },
    {
      "Month": 201405,
      "global": 0.3443
    },
    {
      "Month": 201406,
      "global": 0.246
    },
    {
      "Month": 201407,
      "global": 0.232
    },
    {
      "Month": 201408,
      "global": 0.3116
    },
    {
      "Month": 201409,
      "global": 0.3807
    },
    {
      "Month": 201410,
      "global": 0.4032
    },
    {
      "Month": 201411,
      "global": 0.2885
    },
    {
      "Month": 201412,
      "global": 0.387
    },
    {
      "Month": 201501,
      "global": 0.3835
    },
    {
      "Month": 201502,
      "global": 0.396
    },
    {
      "Month": 201503,
      "global": 0.4229
    },
    {
      "Month": 201504,
      "global": 0.2391
    },
    {
      "Month": 201505,
      "global": 0.3376
    },
    {
      "Month": 201506,
      "global": 0.3601
    },
    {
      "Month": 201507,
      "global": 0.32
    },
    {
      "Month": 201508,
      "global": 0.4178
    },
    {
      "Month": 201509,
      "global": 0.4631
    },
    {
      "Month": 201510,
      "global": 0.6809
    },
    {
      "Month": 201511,
      "global": 0.6232
    },
    {
      "Month": 201512,
      "global": 0.738
    },
    {
      "Month": 201601,
      "global": 0.742
    },
    {
      "Month": 201602,
      "global": 0.885
    },
    {
      "Month": 201603,
      "global": 0.8201
    },
    {
      "Month": 201604,
      "global": 0.7121
    },
    {
      "Month": 201605,
      "global": 0.5762
    },
    {
      "Month": 201606,
      "global": 0.435
    },
    {
      "Month": 201607,
      "global": 0.5268
    },
    {
      "Month": 201608,
      "global": 0.5768
    },
    {
      "Month": 201609,
      "global": 0.554
    },
    {
      "Month": 201610,
      "global": 0.5812
    },
    {
      "Month": 201611,
      "global": 0.6422
    },
    {
      "Month": 201612,
      "global": 0.5341
    },
    {
      "Month": 201701,
      "global": 0.5945
    },
    {
      "Month": 201702,
      "global": 0.6967
    },
    {
      "Month": 201703,
      "global": 0.6938
    },
    {
      "Month": 201704,
      "global": 0.5108
    },
    {
      "Month": 201705,
      "global": 0.5335
    },
    {
      "Month": 201706,
      "global": 0.3757
    },
    {
      "Month": 201707,
      "global": 0.4319
    },
    {
      "Month": 201708,
      "global": 0.4715
    },
    {
      "Month": 201709,
      "global": 0.4758
    },
    {
      "Month": 201710,
      "global": 0.599
    },
    {
      "Month": 201711,
      "global": 0.4853
    },
    {
      "Month": 201712,
      "global": 0.5705
    },
    {
      "Month": 201801,
      "global": 0.4317
    },
    {
      "Month": 201802,
      "global": 0.4598
    },
    {
      "Month": 201803,
      "global": 0.4674
    },
    {
      "Month": 201804,
      "global": 0.4877
    },
    {
      "Month": 201805,
      "global": 0.4128
    },
    {
      "Month": 201806,
      "global": 0.3989
    },
    {
      "Month": 201807,
      "global": 0.4446
    },
    {
      "Month": 201808,
      "global": 0.384
    },
    {
      "Month": 201809,
      "global": 0.3957
    },
    {
      "Month": 201810,
      "global": 0.5942
    },
    {
      "Month": 201811,
      "global": 0.4755
    },
    {
      "Month": 201812,
      "global": 0.5296
    },
    {
      "Month": 201901,
      "global": 0.4753
    },
    {
      "Month": 201902,
      "global": 0.5056
    },
    {
      "Month": 201903,
      "global": 0.702
    },
    {
      "Month": 201904,
      "global": 0.6198
    },
    {
      "Month": 201905,
      "global": 0.5177
    },
    {
      "Month": 201906,
      "global": 0.5424
    },
    {
      "Month": 201907,
      "global": 0.5631
    },
    {
      "Month": 201908,
      "global": 0.5316
    },
    {
      "Month": 201909,
      "global": 0.575
    }
   ];
const co2ConcentrationData = 
[
    {
      "Year": 1979,
      "CO₂ concentration (parts per million)": 336.84
    },
    {
      "Year": 1980,
      "CO₂ concentration (parts per million)": 338.75
    },
    {
      "Year": 1981,
      "CO₂ concentration (parts per million)": 340.11
    },
    {
      "Year": 1982,
      "CO₂ concentration (parts per million)": 341.45
    },
    {
      "Year": 1983,
      "CO₂ concentration (parts per million)": 343.05
    },
    {
      "Year": 1984,
      "CO₂ concentration (parts per million)": 344.65
    },
    {
      "Year": 1985,
      "CO₂ concentration (parts per million)": 346.12
    },
    {
      "Year": 1986,
      "CO₂ concentration (parts per million)": 347.42
    },
    {
      "Year": 1987,
      "CO₂ concentration (parts per million)": 349.19
    },
    {
      "Year": 1988,
      "CO₂ concentration (parts per million)": 351.57
    },
    {
      "Year": 1989,
      "CO₂ concentration (parts per million)": 353.12
    },
    {
      "Year": 1990,
      "CO₂ concentration (parts per million)": 354.39
    },
    {
      "Year": 1991,
      "CO₂ concentration (parts per million)": 355.61
    },
    {
      "Year": 1992,
      "CO₂ concentration (parts per million)": 356.45
    },
    {
      "Year": 1993,
      "CO₂ concentration (parts per million)": 357.1
    },
    {
      "Year": 1994,
      "CO₂ concentration (parts per million)": 358.83
    },
    {
      "Year": 1995,
      "CO₂ concentration (parts per million)": 360.82
    },
    {
      "Year": 1996,
      "CO₂ concentration (parts per million)": 362.61
    },
    {
      "Year": 1997,
      "CO₂ concentration (parts per million)": 363.73
    },
    {
      "Year": 1998,
      "CO₂ concentration (parts per million)": 366.7
    },
    {
      "Year": 1999,
      "CO₂ concentration (parts per million)": 368.38
    },
    {
      "Year": 2000,
      "CO₂ concentration (parts per million)": 369.55
    },
    {
      "Year": 2001,
      "CO₂ concentration (parts per million)": 371.14
    },
    {
      "Year": 2002,
      "CO₂ concentration (parts per million)": 373.28
    },
    {
      "Year": 2003,
      "CO₂ concentration (parts per million)": 375.8
    },
    {
      "Year": 2004,
      "CO₂ concentration (parts per million)": 377.52
    },
    {
      "Year": 2005,
      "CO₂ concentration (parts per million)": 379.8
    },
    {
      "Year": 2006,
      "CO₂ concentration (parts per million)": 381.9
    },
    {
      "Year": 2007,
      "CO₂ concentration (parts per million)": 383.79
    },
    {
      "Year": 2008,
      "CO₂ concentration (parts per million)": 385.6
    },
    {
      "Year": 2009,
      "CO₂ concentration (parts per million)": 387.43
    },
    {
      "Year": 2010,
      "CO₂ concentration (parts per million)": 389.9
    },
    {
      "Year": 2011,
      "CO₂ concentration (parts per million)": 391.65
    },
    {
      "Year": 2012,
      "CO₂ concentration (parts per million)": 393.85
    },
    {
      "Year": 2013,
      "CO₂ concentration (parts per million)": 396.52
    },
    {
      "Year": 2014,
      "CO₂ concentration (parts per million)": 398.65
    },
    {
      "Year": 2015,
      "CO₂ concentration (parts per million)": 400.83
    },
    {
      "Year": 2016,
      "CO₂ concentration (parts per million)": 404.24
    },
    {
      "Year": 2017,
      "CO₂ concentration (parts per million)": 406.55
    },
    {
      "Year": 2018,
      "CO₂ concentration (parts per million)": 408.52
    }
   ];
const VictoryZoomVoronoiContainer = createContainer("zoom", "voronoi");

class TempChart extends React.Component {
    constructor(props){
        super(props);
        let year = Number('201'+this.props.year);
        this.state = {
            year: this.props.year,
            zoomDomain: { x: [new Date(year, 1), new Date(year, 12)] }
          };
    }

    handleZoom(domain) {
        this.setState({ 
            year: this.props.year,
            zoomDomain: domain 
        });
      }

    formatTempData(){
        let data =
        airTempData.map(obj => ({
            date: new Date(String(obj.Month).substring(0,4), String(obj.Month).substring(4)),
            anomaly: obj.global,
            fill: '201'+this.props.year === String(obj.Month).substring(0,4) ? '#ff9912' : (obj.global < 0 ? '#4682b4' : 'tomato'),
        }));
        return data;
    }

    formatCo2Data(){
        let data = 
        co2ConcentrationData.map(obj => ({
            date: new Date(obj.Year, 6),
            concentration: obj["CO₂ concentration (parts per million)"]/1000
        }));
        // for (let i = 1; i < co2ConcentrationData.length; i++){
        //     data.push({
        //         year: new Date(co2ConcentrationData[i].Year,6),
        //         concentration: co2ConcentrationData[i]["CO₂ concentration (parts per million)"] - co2ConcentrationData[i-1]["CO₂ concentration (parts per million)"]
        //     })
        // }
        // console.log(data);
        return data;
    }
        
    render(){

        return(
            <div style={{display: "flex", flexWrap: "wrap", width: '100%', padding: '10%', marginLeft: 750, marginTop: -450}}>
                <div>
                    <VictoryChart width={600} height={400} scale={{ x: "time" }}
                    containerComponent={
                        <VictoryZoomVoronoiContainer
                            zoomDimension="x"
                            // zoomDomain={this.state.zoomDomain}
                            zoomDomain={this.props.year === this.state.year ? this.state.zoomDomain : { x: [new Date(Number('201'+this.props.year)-1, 8), new Date(Number('201'+this.props.year)+1, 3)] }}
                            // zoomDomain={{ x: [new Date(Number('201'+this.props.year), 1), new Date(Number('201'+this.props.year), 12)] }}
                            onZoomDomainChange={this.handleZoom.bind(this)}
                            labels={({ datum }) => (!datum.anomaly ? `${datum.date.getFullYear()}: ${datum.concentration}K ppm` :(`${months[datum.date.getMonth()]} ${datum.date.getFullYear()}: ${datum.anomaly} °C`))}
                        />
                    }
                    >
                        <VictoryLabel text="Monthly Global Surface Air Temp. Anomalies (°C)" x={300} y={30} textAnchor="middle"/>
                        <VictoryLine
                            barWidth={8}
                            // style={{
                            //     data: {fill: ({ datum }) => datum.fill}
                            // }}
                            style={{
                                data: { stroke: "tomato" }
                              }}
                            data={this.formatTempData()}
                            x="date"
                            y="anomaly"
                        />
                        {/* <VictoryLine
                            data={this.formatTempData()}
                            x="date"
                            y="anomaly"
                            style={{
                                data: { stroke: "red" }
                            }}
                        ></VictoryLine> */}
                        <VictoryLine
                            data={this.formatCo2Data()}
                            x="date"
                            y="concentration"
                            stroke='black'
                        >
                        </VictoryLine>
                        <VictoryLabel
                            text=" • CO2 concentration in thousands ppm"
                            y={50}
                            x={175}
                        />
                    </VictoryChart>
                    <div style={{marginTop: -80}}>
                        <VictoryChart
                            padding={{ top: 0, left: 50, right: 50, bottom: 30 }}
                            width={600} height={100} scale={{ x: "time" }}
                            containerComponent={
                            <VictoryBrushContainer
                                brushDimension="x"
                                // brushDomain={this.state.zoomDomain}
                                brushDomain={this.props.year === this.state.year ? this.state.zoomDomain : { x: [new Date(Number('201'+this.props.year)-1, 8), new Date(Number('201'+this.props.year)+1, 3)] }}

                                // zoomDomain={{ x: [new Date(Number('201'+this.props.year), 1), new Date(Number('201'+this.props.year), 12)] }}
                                onBrushDomainChange={this.handleZoom.bind(this)}
                            />
                            }
                        >
                            <VictoryAxis
                            tickFormat={(x) => new Date(x).getFullYear()}
                            />
                            <VictoryBar
                                style={{
                                    data: {fill: ({ datum }) => datum.fill}
                                }}
                                data={this.formatTempData()}
                                x="date"
                                y="anomaly"
                            />
                            <VictoryLine
                                data={this.formatCo2Data()}
                                x="date"
                                y="concentration"
                            >   
                            </VictoryLine>
                        </VictoryChart>
                    </div>

                </div>
                {/* <div style={{minWidth: '60%'}}>
                    <VictoryChart height={300} width={1300}
                    
                        animate={{
                            duration: 500
                        }}
                        domainPadding={{ x: 50, y: [0, 20] }}
                        containerComponent={
                            <VictoryVoronoiContainer
                            style={{padding: 10}}
                            labels={({ datum }) => 
                                datum.y > 0 ? `  ${datum.y} MWh` : null
                            } 
                            />
                        }
                    >
                        <VictoryLabel text="Monthly Global Surface Air Temp. Anomalies (°C)" x={225} y={30} textAnchor="middle"/>
                        <VictoryAxis
                            // offsetY={150}
                            // tickValues={[1979, 2019]}
                        />
                        <VictoryAxis
                            dependentAxis
                            // offsetY={150}
                        />
                        <VictoryBar
                            barWidth={5}
                            padding={{ left: 20, right: 60 }}
                            style={{data:{
                                fill: ({ datum }) => datum.fill,
                            }}}
                            data={this.formatTempData()}
                            events={[{
                                target: 'data',
                                eventHandlers: {
                                    onClick: (event, data) => {
                                        this.props.setYear(Number(data.datum.x.substring(2,3)))
                                    },
                                },
                            }]}
                        />
                    </VictoryChart>
                </div> */}
            </div>
        );
    }
}


const energyTypes = ['hydroelectric', 'wind', 'solarPhotovoltaic', 'woodFuels'];
class HorizBarChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wind: [],
            solarPhotovoltaic: [],
            woodFuels: [],
            hydroelectric: [],
            loading: true,
            splitByType: true,
        }
        this.handleCheckboxInputChange = this.handleCheckboxInputChange.bind(this);
    }
    configBarData(){
        let wind = [];
        let solar = [];
        let wood = [];
        let hydro = [];
        console.log(this.props.data);
        for (let i = 0; i < this.props.data.length; i++){
            wind.push(parseFloat(this.props.data[i]["Wind"].replace(/,/g, '')));
            solar.push(parseFloat(this.props.data[i]["Solar Photovoltaic"].replace(/,/g, '')));
            wood.push(parseFloat(this.props.data[i]["Wood and Wood-Derived Fuels"].replace(/,/g, '')));
            hydro.push(parseFloat(this.props.data[i]["Conventional Hydroelectric"].replace(/,/g, '')));

        }
        this.setState({
            wind: wind,
            solarPhotovoltaic: solar,
            woodFuels: wood,
            hydroelectric: hydro
        })
    }

    monthlySumData(){
        let sums = [];
        let types = ['Wind', 'Solar Photovoltaic', 'Wood and Wood-Derived Fuels', 'Conventional Hydroelectric'];
        console.log(this.props.data[0]['Wind']);
        for (let i = 0; i < this.props.data.length; i++){
            let sum = types.reduce((acc, val) => {
   
                return acc + parseFloat(this.props.data[i][val].replace(/,/g, ''));
            }, 0)
            sums.push({
                x: months[i],
                y: sum,
            });
        }
        console.log(sums);
       return sums;
    }

    categoryLabel(category){
        let label = '';
        switch (category){
            case 'wind':
                label = 'Wind'
                break;
            case 'solarPhotovoltaic':
                label = 'Solar Photovoltaic';
                break;
            case 'woodFuels':
                label = 'Wood Fuels';
                break;
            case 'hydroelectric':
                label = 'Hydroelectric';
        }
        return label;
    }

    configCategoryData(category){
        let data = [];
        for (let i = 0; i < 12; i++){
            data.push(
                {
                    x: months[i],
                    y:this.state[category][i],
                    category: this.categoryLabel(category),
                }
            )
        }
        return data;
    }

    handleCheckboxInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.checked;
        this.setState({
            [name]: value,
        })
    }

    componentDidMount(){
        this.configBarData();
        this.setState({loading: false});
    }
    render() {
        if (this.state.loading 
            || this.state.wind.length === 0 
            || this.state.solarPhotovoltaic.length === 0 
            || this.state.woodFuels.length === 0
            || this.state.hydroelectric.length === 0){
            return(<div>loading...</div>);
        }
        return (
            <>
            <strong style={{lineHeight: 3, fontSize: 20}}>Net Generation from Top Four Renewable Sources in 2018</strong>
            <div>in Thousand Megawatthours</div>
            <label>
            <input
                style={{margin: 10}}
                name="splitByType"
                type="checkbox"
                checked={this.state.splitByType}
                onChange={this.handleCheckboxInputChange} />
                Split by energy type
            </label>
            <div style={{marginLeft: "30%", marginRight: "30%", marginBottom: '10%'}}>
                <VictoryChart
                    // theme={VictoryTheme.material}
                    domainPadding={{ y: 12, x: 12 }}
                    domain={{ y: [0.5, 100000] }}
                    containerComponent={
                        <VictoryVoronoiContainer
                        style={{padding: 10}}
                        labels={
                            this.state.splitByType ? (
                                ({ datum }) => datum.y > 0 ? `${datum.category} \n ${datum.y} MWh` : null) 
                            : (({ datum }) => datum.y > 0 ? `  ${datum.y} MWh` : null) 
                        } 
                        />
                    }
                >
                    {
                        this.state.splitByType ? (
                            <VictoryLegend x={300} y={50}
                                title="Energy Sources"
                                centerTitle
                                orientation="vertical"
                                gutter={15}
                                style={{ border: { stroke: "black" }, title: {fontSize: 10 } }}
                                data={[
                                { name: "Hydroelectric", symbol: { fill: "brown" } },
                                { name: "Wind", symbol: { fill: "gold"} },
                                { name: "Solar", symbol: { fill: "tomato" } },
                                { name: "Wood Fuels", symbol: { fill: "orange" } },
                                ]}
                            />
                        ) : (
                            <VictoryLegend x={300} y={50}
                                title="Energy Sources"
                                centerTitle
                                orientation="vertical"
                                gutter={15}
                                style={{ border: { stroke: "black" }, title: {fontSize: 10 } }}
                                data={[
                                { name: "Hydroelectric", symbol: { fill: "white" } },
                                { name: "Wind", symbol: { fill: "white" } },
                                { name: "Solar", symbol: { fill: "white" } },
                                { name: "Wood Fuels", symbol: { fill: "white" } },
                                ]}
                            />
                        )
                    }
                      
                    <VictoryGroup horizontal
                    offset={10}
                    style={{ data: { width: 13 } }}
                    colorScale={["brown", "gold", "orange", "tomato"]}
                    >
                    <VictoryStack>
                        
                        {
                            this.state.splitByType ? (
                                energyTypes.map((energyType, index) => {
                                    return <VictoryBar key={index} data={this.configCategoryData(energyType)}/>
                                })
                            ) : (<VictoryBar data={this.monthlySumData()} colorScale={['#8DC3A7']}/>)

                        }
                    </VictoryStack>
                </VictoryGroup>
                </VictoryChart>
            </div>
            </>
        );
    }
}

// let sampleDataPolar = [
//     { x: 100, y: 3},
// ];

// let sampleDataPolar2 = [
//     { x: 300, y: 10},
//     { x: 300, y: 5},
// ];

// let sampleDataPolar3 = [
//     { x: 10, y: 4},
// ];


// class PieChart extends React.Component {
//     constructor(props){
//         super(props);
//     }
//     render(){
//         return (
//             <>
//             <div style={{marginLeft: "30%", marginRight: "30%", marginTop: "5%"}}>
//                 <VictoryPie
//                 // style={{ parent: { minWidth: "50%" }}}
//                 colorScale={["tomato", "orange", "gold", "cyan", "navy", "white" ]}
//                 data={[
//                     { x: "Cats", y: 35 },
//                     { x: "Dogs", y: 40 },
//                     { x: "Birds", y: 55 },
//                     { x: "Frogs", y: 55 },
//                     { x: "Mice", y: 55 },
//                     { x: "Snakes", y: 10 }
//                 ]}
//                 // data={this.configData()}
//                 />
//             </div>
            
            
//             <div style={{marginLeft: "30%", marginRight: "30%"}}>
//             <VictoryBar polar
                
//                 data={[
//                     { x: 100, y: 3 },
//                     { x: 6, y: 5 },
//                     { x: 50, y: 2 },
              
//                 ]}
//                 width={400} height={400}
//                 domain={{ x: [0, 360], y: [0, 5] }}
//                 style={{ data: { fill: "#c43a31", stroke: "black", strokeWidth: 2 } }}
//             />
//             </div>
                
//             <div style={{marginLeft: "30%", marginRight: "30%"}}>
//                 <VictoryChart polar
//                     maxDomain={{ x: 360 }}
//                     height={250} width={250}
//                     padding={30}
//                 >
//                 <VictoryPolarAxis dependentAxis
//                     style={{
//                     axis: {stroke: "none"},
//                     tickLabels: { fill: "none"},
//                     grid: { stroke: "grey", strokeDasharray: "4, 8" }
//                     }}
//                 />
//                 <VictoryPolarAxis
//                     tickValues={[0, 45, 90, 135, 180, 225, 270, 315]}
//                 />
//                 <VictoryStack
//                     colorScale={["#ad1b11", "#c43a31", "#dc7a6b", "pink", "green", "blue"]}
//                     style={{ data: { width: 50} }}
//                 >
//                     <VictoryBar data={sampleDataPolar}/>
//                     <VictoryBar data={sampleDataPolar2}/>
//                     <VictoryBar data={sampleDataPolar3}/>
//                 </VictoryStack>
//                 </VictoryChart>
//             </div>
           
            

//             </>
//         );
//     }
// }

