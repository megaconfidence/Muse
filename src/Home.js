import React, { useState, useCallback, useRef, useEffect } from 'react';
import './App.css';
import Nav from './components/Nav';
import {
  Route,
  Switch,
  HashRouter as Router,
  withRouter
} from 'react-router-dom';
import Play from './routes/Play';
import Queues from './routes/Queues';
import Albums from './routes/Albums';
import Artist from './routes/Artist';
import PlayLists from './routes/PlayList';
import Genre from './routes/Genre';
import apiData from './data.json';
import View from './routes/View';
import NowPlaying from './components/NowPlaying';
import { forceCheck } from 'react-lazyload';

const Home = withRouter(({ location, history }) => {
  const { data } = apiData;
  const songs = data;
  const albums = [];
  for (const artist in songs) {
    albums.push(songs[artist]);
  }
  const [playing, setPlaying] = useState({ val: {} });
  const playerRef = useRef(null);
  const [playPath, setPlayPath] = useState({ val: '' });

  const setNowPlaing = data => {
    console.log(data);
  };

  const getHistory = useCallback(() => {
    const togglePlayer = () => {
      if (playerRef.current) {
        const path = location.pathname;
        if (path.includes('/play') && !path.includes('/playlist')) {
          playerRef.current.classList.remove('hide');
        } else {
          playerRef.current.classList.add('hide');
        }
      }
    };
    togglePlayer();
    history.listen(location => {
      togglePlayer();
    });
  }, [history, location.pathname]);

  const setPlayingData = useCallback(data => {
    // console.log('gotten', data)
    setPlaying({ val: data });
  }, []);
  const setPlayPathData = useCallback(data => {
    setPlayPath({ val: data });
  }, []);

  useEffect(() => {
    getHistory();
    forceCheck()
    if (location.pathname.includes('/play/')) {
      setPlayPath({ val: location.search });
    }
  }, [getHistory, location]);
  return (
    <Router>
      <div className='App'>
        <Nav playPath={playPath.val} />

        <NowPlaying
          data={playing.val}
          playPath={playPath.val}
          songs={songs}
          ref={playerRef}
        />

        <Switch>
          <Route
            path='/play/:playId'
            render={props => (
              <Play
                {...props}
                songs={songs}
                setNowPlaing={setNowPlaing}
                setPlayingData={setPlayingData}
                setPlayPathData={setPlayPathData}
              />
            )}
          />
          <Route exact path='/queues' render={props => <Queues {...props} />} />
          <Route
            exact
            path='/albums'
            render={props => <Albums {...props} albums={albums} />}
          />
          <Route
            exact
            path='/artist'
            render={props => <Artist {...props} songs={songs} />}
          />
          <Route
            exact
            path='/playlists'
            render={props => <PlayLists {...props} />}
          />
          <Route exact path='/genre' render={props => <Genre {...props} />} />
          <Route
            exact
            path='/view/:category/:viewId'
            render={props => <View {...props} songs={songs} />}
          />
        </Switch>
      </div>
    </Router>
  );
});

export default Home;
// export default withRouter(App);
