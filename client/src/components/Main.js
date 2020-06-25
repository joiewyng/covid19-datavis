import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Data from './Data';
import Manage from './Manage'
import BubbleChartDb from './BubbleChartDb';
import USADataDb from './USADataDb';

const Main = () => {
  return (
    <Switch> {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path='/' component={Data}></Route>
      <Route exact path='/manage' component={BubbleChartDb}></Route>
      {/* <Route exact path='/manage' component={USADataDb}></Route> */}
    </Switch>
  );
}

export default Main;