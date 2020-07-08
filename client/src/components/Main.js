import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Data from './Data';
import BubbleChartDb from './BubbleChartDb';
import DataTwo from './DataTwo';
import DataThree from './DataThree';

const Main = () => {
  return (
    <Switch> {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path='/' component={Data}></Route>
      <Route exact path='/manage' component={BubbleChartDb}></Route>
      <Route exact path='/data2' component={DataTwo}></Route>
      <Route exact path='/data3' component={DataThree}></Route>
    </Switch>
  );
}

export default Main;