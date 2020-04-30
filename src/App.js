import Home from './Home';
import React, { useState, useEffect } from 'react';
import apiData from './data.json';
import { Route, HashRouter as Router, Switch } from 'react-router-dom';
import AppContext from './components/hooks/AppContext';
import defaultContext from './components/hooks/defaultContext';
import Signin from './routes/Signin';
import Protect from './components/Protect';
import NoMatch from './routes/NoMatch';
import config from 'environment';

const App = () => {
  const { data } = apiData;
  const appData = useState(() => {
    const user = JSON.parse(localStorage.getItem(`${config.appName}_USER`));
    if (user) {
      return { user };
    } else {
      return defaultContext;
    }
  });

  return (
    <AppContext.Provider value={appData}>
      <Router>
        <div className='App'>
          <Switch>
            <Route exact path='/signin' render={(props) => <Signin />} />
            <Route
              path='/'
              render={(props) => <Protect children={<Home data={data} />} />}
            />
          </Switch>
        </div>
      </Router>
    </AppContext.Provider>
  );
};

export default App;
// export default withRouter(App);
