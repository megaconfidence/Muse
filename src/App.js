import Home from './Home';
import config from 'environment';
import Signin from './routes/Signin';
import React, { useState } from 'react';
import Protect from './components/Protect';
import AppContext from './components/hooks/AppContext';
import { Route, HashRouter as Router, Switch } from 'react-router-dom';
import defaultContext from './components/hooks/defaultContext';

const App = () => {
  const appData = useState(() => {
    const user = JSON.parse(localStorage.getItem(`${config.appName}_USER`));
    const queue = JSON.parse(localStorage.getItem(`${config.appName}_QUEUES`));
    const playing = JSON.parse(
      localStorage.getItem(`${config.appName}_PLAYING`)
    );
    const playlist = JSON.parse(
      localStorage.getItem(`${config.appName}_PLAYLIST`)
    );
    const playingQueue = JSON.parse(
      localStorage.getItem(`${config.appName}_PLAYING_QUEUES`)
    );
    const likes = JSON.parse(localStorage.getItem(`${config.appName}_LIKES`));
    const recents = JSON.parse(
      localStorage.getItem(`${config.appName}_RECENTS`)
    );
    if (user) {
      return {
        ...defaultContext,
        user,
        queue: queue || [],
        likes: likes || [],
        playing: playing || [],
        recents: recents || [],
        playlist: playlist || [],
        playingQueue: playingQueue || []
      };
    } else {
      return defaultContext;
    }
  });

  return (
    <AppContext.Provider value={appData}>
      <Router>
        <div className='App'>
          <Switch>
            <Route
              exact
              path='/signin'
              render={(props) => <Signin {...props} />}
            />
            <Route
              path='/'
              render={(props) => <Protect {...props} children={<Home  {...props}/>} />}
            />
          </Switch>
        </div>
      </Router>
    </AppContext.Provider>
  );
};

export default App;
// export default withRouter(App);
