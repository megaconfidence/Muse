import Home from './Home';
import React from 'react';
import apiData from './data.json';
import NoMatch from './routes/NoMatch';
import { Route, HashRouter as Router, Switch } from 'react-router-dom';

const App = () => {
  const { data } = apiData;

  return (
    <Router>
      <div className='App'>
        <Switch>
          <Route path='/' render={props => <Home {...props} data={data} />} />
          <Route component={NoMatch} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
// export default withRouter(App);
