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
   } from 'victory';
export default class DataTwo extends React.Component {

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
        await fetch("http://localhost:9000/energyDB")
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
                        <DonutChart 
                            data={this.state.json[0]["Annual Totals"]} 
                            setYear={this.setDonutYear} 
                            year={this.state.donutYear}
                        />
                        <DonutDataUpdate
                            data={this.state.json[0]["Annual Totals"]}
                            year={this.state.donutYear}
                            updateData={this.updateDonutData}
                        />
                    </div>
                    
                    <HorizBarChart data={this.state.json[1]["Year 2018"]}/>
                    {/* <PieChart/> */}
                </div>
            );
        }
    }
}

class DonutDataUpdate extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            year: 9,
            data: JSON.stringify(this.props.data[9]),
            Wind: this.props.data[this.props.year]['Wind'],
            selectedFile: '',
            fileList: [{value: '', display: '-- Select a dataset --'}],
            
        }
        this.handleChange = this.handleChange.bind(this);
        this.updateDataRequest = this.updateDataRequest.bind(this);
        this.updateData = this.updateData.bind(this);
        this.handleRestore = this.handleRestore.bind(this);
    }

    async updateDataRequest() {
        let url = "http://localhost:9000/energyDB/donut?update=true";
        await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                data: JSON.parse(this.state.data),
                year: this.state.year
            }),
            headers: {"Content-Type": "application/json"}
        }).then(function(response){
            return response.json();
        }).then(dataJson => {
            console.log(Array.from(dataJson));
            this.setState({json: Array.from(dataJson)});
            console.log(JSON.stringify(this.state.json));
            this.props.updateDonutData(dataJson);
            return this.state.donutData;
        }).catch(err => err);
    }

    async handleReset(event) {
        let url = "http://localhost:9000/energyDB/donut?reset=true"
         await fetch(url, {
             method: 'POST'
         }).then(function(response){
             return response.json();
         }).then(dataJson => {
             this.setState({
                 json: Array.from(dataJson),
                 data: JSON.stringify(dataJson[0]["Annual Totals"][9])
             });
             console.log('reset:')
             console.log(JSON.stringify(dataJson));
             return this.state.json
         }).catch(err => err);
    }

    async handleSave(event) {
        // event.preventDefault();
        let url = "http://localhost:9000/energyDB/donut?save=true"
        await fetch(url, {
            method: 'POST'
        }).then(function(response){
            return response.json();
        }).then(dataJson => {
            console.log('saved');
            return dataJson
        }).catch(err => err);
    }

    async updateData(event){
        // event.preventDefault();
        await this.updateDataRequest();
    }

    handleChange = prop => async(event) => {
        await this.setState({[prop]: event.target.value});
        if (prop === 'year') this.setState({data: JSON.stringify(this.props.data[this.state.year])});
    }

    async loadFileNames() {
        let url = "http://localhost:9000/energyDB/donut/filelist";
        await fetch(url)
        .then((response) => {
            return response.json();
        }).then(data => {
            console.log(data);
            let fileList = data.map(file => {
              return {value: file, display: file}
            });
            this.setState({
              fileList: [{value: '', display: '-- Select a dataset --'}].concat(fileList)
            });
        }).catch(error => {
            console.log(error);
        });
    }

    async handleRestore(event) {

        let url = "http://localhost:9000/energyDB/donut?restore=true&file=" + this.state.selectedFile;
        await fetch(url, {
            method: 'POST'
        }).then(function(response){
            return response.json();
        }).then(dataJson => {
            console.log('does not reach this point...');
            this.setState({
                json: Array.from(dataJson),
                data: JSON.stringify(dataJson[0]["Annual Totals"][9]),
            });
            console.log(JSON.stringify(dataJson));
            return this.state.json
        }).catch(err => err);
    }

    async componentDidMount(){
        await this.loadFileNames();
    }


    render(){
        return (
            <div style={{margin: '7%', marginLeft: '3%'}}>
                <button onClick={this.handleReset} style={{margin: 10, padding: 5}}>Reset</button>
                <button onClick={this.handleSave} style={{margin: 10, padding: 5}}>Save Dataset</button>
                <div>
                    <select 
                        style={{padding:3, margin: 20}}
                        value={this.state.selectedDataFile}
                        onChange={async(e) => {
                            await this.setState({selectedFile: e.target.value});
                            if (this.state.selectedFile !== ''){
                                this.loadFileNames();
                            }
                        }}
                    >
                        {this.state.fileList.map((file) => 
                        <option key={file.value} value={file.value}>{file.display}</option>
                        )}
                    </select>
                    <button onClick={this.handleRestore} style={{margin: 8, padding: 5}}>Restore</button>
                </div>
                <form onSubmit={this.updateData}>
                    <div>
                        <select style={{margin: 15, padding:5}} value={this.state.year} onChange={this.handleChange('year')}>
                        {[0,1,2,3,4,5,6,7,8,9].map((num, index) => {
                            return <option value={num} key={index}>201{num}</option>
                        })}
                        </select>
                    </div>
                    <div>
                        <label style={{width: 70, float: 'left', margin: 10, marginLeft: -5}}>
                            Data:  
                        </label>
                        <textarea 
                            type='text'
                            value={this.state.data} 
                            onChange={this.handleChange('data')} 
                            style={{height: 200, width: '90%'}}
                            
                        />
                    </div>
                    <input type="submit" value="Update" style={{margin: 10, float: 'right'}}/>
                </form>
            </div>
            
        );
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
            // year: 9,
            sum: 720435,
            showMore: false,
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
        if (this.state.showMore){
            return(<MoreData/>);
        }
        return (
            <>
            <div style={{minWidth: '50%', padding: '5%'}}>
                <div style={{marginBottom: -20}}>
                    <strong style={{lineHeight: 3, fontSize: 20}}>Net Generation from Renewable Sources</strong>
                    <div>MWh = Megawatthours</div>
                    <select style={{margin: 15, padding:5}} value={this.props.year} onChange={this.handleChange}>
                        {[0,1,2,3,4,5,6,7,8,9].map((num, index) => {
                            return <option value={num} key={index}>201{num}</option>
                        })}
                    </select>
                </div>
    
                <div style={{width: '80%', marginLeft: '10%'}}>
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
                        events={[{
                            target: 'data',
                            eventHandlers: {
                                onClick: (event, data) => {
                                    console.log('click');
                                    this.setState({showMore: true});
                                },
                            },
                        }]}
                    />
                </div>
                <div  style={{marginTop: "-45%", fontSize: 33}}>201{this.props.year}</div>
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
class MoreData extends React.Component {
    
    constructor(props){
        super(props);
    }

    formatData(x, y, category){
        let data = [];
        for (let i = 0; i < x.length; i++){
            data.push({
                x: x[i],
                y: y[i],
                category: category
            })
        }
        console.log(data);
        return data;
    }
    
    render(){
        return ( <>
            <div style={{display: "flex", flexWrap: "wrap", width: '100%', padding: '10%'}}>
                <div style={{minWidth: '49%'}}>
                    <div><strong> Net Generation of Petroleum Liquids</strong></div>
                    <div> in Thousand Megawatthours</div>
                    <VictoryChart height={400} width={400}
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
                        style={{data:{fill: 'tomato'}}}
                        data={this.formatData(years, petroleumLiquidsData)}
                    />
                    </VictoryChart>
                </div>
                <div style={{minWidth: '49%'}}>
                    <div><strong> Hybrid Electric Vehicle and Plug-In Electric Vehicle Sales</strong></div>
                    <div>in Thousands</div>
                    <VictoryChart height={400} width={400}
                    
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
                            style={{data:{fill: '#8DC3A7'}}}
                            data={this.formatData(years, hevSales, 'HEV')}
                        />
                        <VictoryBar

                        barWidth={20}
                        padding={{ left: 20, right: 60 }}
                        style={{data:{fill: '#4E9C81'}}}
                        data={this.formatData(years, pevSales, 'PEV')}
                        />
                        </VictoryStack>
                    
                    </VictoryChart>
                </div>
                
            </div>
            <div style={{width: '60%', marginLeft: '20%'}}>
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
        </div>
        </>
        );
    }
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
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