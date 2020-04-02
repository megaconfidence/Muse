import React from 'react';
import './App.css';
import { Route, HashRouter as Router, Switch } from 'react-router-dom';
import NoMatch from './routes/NoMatch';
import apiData from './data.json';
import Home from './Home';

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
