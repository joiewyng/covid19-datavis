import React from 'react';
import {
     VictoryChart,
     VictoryAxis, 
     VictoryBar, 
     VictoryTheme, 
     VictoryVoronoiContainer,
     VictoryLabel,
     VictoryStack,
     VictoryArea
    } from 'victory';

export default class StackChart extends React.Component {
    state = {
        loading: true,
        json: {}
       
    };

    render() {
        if (this.state.loading){
            return(<div>loading...</div>);
        }

        return (

            <VictoryChart
            height={400}
            width={400}
            padding={100}
            animate={{
                duration: 500
            }}
            >
            <VictoryStack>
                <VictoryArea
                    data={[{x: "a", y: 2}, {x: "b", y: 3}, {x: "c", y: 5}]}
                />
                <VictoryArea
                    data={[{x: "a", y: 1}, {x: "b", y: 4}, {x: "c", y: 5}]}
                />
                <VictoryArea
                    data={[{x: "a", y: 3}, {x: "b", y: 2}, {x: "c", y: 6}]}
                />
            </VictoryStack>
            </VictoryChart>

            ); 
    }
}