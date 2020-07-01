import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Data from './Data';
import BubbleChartDb from './BubbleChartDb';
import DataTwo from './DataTwo';

const Main = () => {
  return (
    <Switch> {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path='/' component={Data}></Route>
      <Route exact path='/manage' component={BubbleChartDb}></Route>
      <Route exact path='/data2' component={DataTwo}></Route>
    </Switch>
  );
}

export default Main;