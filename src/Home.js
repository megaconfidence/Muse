import {
  Route,
  Switch,
  withRouter,
  HashRouter as Router
} from 'react-router-dom';
import './App.css';
import Play from './routes/Play';
import Root from './routes/Root';
import View from './routes/View';
import apiData from './data.json';
import Nav from './components/Nav';
import Genre from './routes/Genre';
import Queues from './routes/Queues';
import Albums from './routes/Albums';
import Artist from './routes/Artist';
import { useSnackbar } from 'notistack';
import PlayLists from './routes/PlayList';
import NowPlaying from './components/NowPlaying';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Signin from './routes/Signin';
import request from './helpers';
import config from 'environment';
import colorLog from './helpers/colorLog';

const Home = withRouter(({ location, history }) => {
  const { data } = apiData;
  const songs = data;
  const playerRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const [playing, setPlaying] = useState({ val: {} });
  const [playPath, setPlayPath] = useState({ val: '' });
  const [songQueues, setSongQueues] = useState(() => {
    const queue = JSON.parse(
      localStorage.getItem(`${config.appName}_SONGQUEUES`)
    );
    if (queue) {
      return { val: queue };
    } else {
      return { val: [] };
    }
  });

  const albums = [];
  for (const artist in songs) {
    albums.push(songs[artist]);
  }

  const setNowPlaing = data => {
    console.log(data);
  };

  const savePlayList = useCallback(async data => {
    try {
      localStorage.setItem(
        `${config.appName}_SONGQUEUES`,
        JSON.stringify(data.content)
      );
      localStorage.setItem(
        `${config.appName}_QUEUEID`,
        JSON.stringify(data._id)
      );
      setSongQueues({ val: data.content });
      colorLog('Playlist saved', 'success');
    } catch (err) {
      console.log(err);
    }
  }, []);

  const getPlayList = useCallback(async () => {
    try {
      colorLog('Getting playlist', 'info');
      let data = await request('get', 'api/playlist');
      data = data.data.data[0];
      if (data) {
        savePlayList(data);
      }
    } catch (err) {
      console.log(err);
    }
  }, [savePlayList]);

  const uploadPlayList = async list => {
    savePlayList({ content: list, _id: undefined });
    try {
      const payload = {
        content: list
      };

      let id = localStorage.getItem(`${config.appName}_QUEUEID`);
      if (id && id !== 'undefined') {
        id = JSON.parse(id);
      }
      let data = await request('put', `api/playlist/${id}`, payload);

      if (data) {
        data = data.data.data;
        savePlayList(data);
      } else {
        colorLog('Creating new playlist', 'info');
        data = await request('post', `api/playlist/`, payload);
        data = data.data.data;
        savePlayList(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSetSongQueues = (type, data) => {
    const addSong = aData => {
      const arr = songQueues.val;
      arr.push({
        ...aData,
        queueId: songQueues.val.length
      });
      uploadPlayList(arr);
    };

    if (type === 'add') {
      addSong(data);
      enqueueSnackbar(`Song added to queue`);
    } else if (type === 'play') {
      addSong(data);
    } else if (type === 'remove') {
      const filterSong = s => {
        if (s.queueId === data) {
          //Do nothing it the match is exact
        } else {
          return s;
        }
      };
      const arr = songQueues.val.filter(filterSong);
      const arr2 = arr.map((s, i) => ({ ...s, queueId: i }));

      uploadPlayList(arr2);
      enqueueSnackbar(`Song removed from queue`);
    }
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
    setPlaying({ val: data });
  }, []);

  const setPlayPathData = useCallback(data => {
    setPlayPath({ val: data });
  }, []);

  useEffect(() => {
    getHistory();
    getPlayList();
    if (location.pathname.includes('/play/')) {
      setPlayPath({ val: location.search });
    }
  }, [getHistory, getPlayList, location, savePlayList]);

  return (
    <Router>
      <div className='App'>
        <Nav playPath={playPath.val} />

        <NowPlaying
          songs={songs}
          ref={playerRef}
          data={playing.val}
          playPath={playPath.val}
          songQueues={songQueues.val}
        />

        <Switch>
          <Route exact path='/' render={props => <Root />} />
          <Route exact path='/signin' render={props => <Signin />} />
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
          <Route
            exact
            path='/genre'
            render={props => <Genre {...props} songs={songs} />}
          />
          <Route
            exact
            path='/view/:category/:viewId'
            render={props => (
              <View
                {...props}
                songs={songs}
                songQueues={songQueues.val}
                handleSetSongQueues={handleSetSongQueues}
              />
            )}
          />
        </Switch>
      </div>
    </Router>
  );
});

export default Home;
// export default withRouter(App);
