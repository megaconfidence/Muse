import {
  Route,
  Switch,
  Redirect,
  HashRouter as Router
} from 'react-router-dom';
import './App.css';
import View from './routes/View';
import Nav from './components/Nav';
import Genre from './routes/Genre';
import Queues from './routes/Queues';
import Albums from './routes/Albums';
import config from 'environment';

import Artist from './routes/Artist';
import Search from './routes/Search';
import NoMatch from './routes/NoMatch';
import PlayLists from './routes/PlayList';
import Settings from './routes/Settings';
import NowPlaying from './components/NowPlaying';
import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useSnackbar } from 'notistack';

const Home = ({ location, history }) => {
  const playerRef = useRef(null);
  const playerCompRef = useRef(null);
  const deferredPrompt = useRef(null);
  const queuePlayBtnRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();

  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showInstallPlaceholder, setShowInstallPlaceholder] = useState(false);

  const handlePlayer = useCallback(() => {
    const togglePlayer = () => {
      if (playerCompRef.current) {
        const path = location.pathname;
        if (path.includes('/play/') || path.endsWith('/play')) {
          playerCompRef.current.classList.remove('cover');
        } else {
          playerCompRef.current.classList.add('cover');
        }
      }
    };
    togglePlayer();
    history.listen((location) => {
      togglePlayer();
    });
  }, [history, location.pathname]);

  // console.log('test console.log');

  const showPWABanner = useCallback(() => {
    const isPWAInstalled = localStorage.getItem(
      `${config.appName}_PWA_PROMPT_RESPONDED`
    );
    if (playerRef.current && !isPWAInstalled) {
      playerRef.current.audio.current.addEventListener('playing', (event) => {
      setTimeout(() => {
        setShowInstallPlaceholder(true);
        setTimeout(() => {
          setShowInstallBanner(true);
        }, 500);
      }, 10000);
      });
    }
  }, []);

  const installPWA = useCallback(() => {
    setShowInstallBanner(false);
    setShowInstallPlaceholder(false);
    if (deferredPrompt.current) {
      deferredPrompt.current.prompt();
      deferredPrompt.current.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          localStorage.setItem(`${config.appName}_PWA_PROMPT_RESPONDED`, true);
          enqueueSnackbar('Awesome! Muse is being installed');
        }
        deferredPrompt.current = null;
      });
    }
  }, [enqueueSnackbar]);

  const dismissPWA = useCallback(() => {
    setShowInstallBanner(false);
    setTimeout(() => {
      setShowInstallPlaceholder(false);
    }, 500);
    localStorage.setItem(`${config.appName}_PWA_PROMPT_RESPONDED`, true);
  }, []);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt.current = e;
    });
    window.addEventListener('appinstalled', () => {
      enqueueSnackbar('Install successful. Check your homescreen!');
    });
  }, [enqueueSnackbar]);

  useEffect(() => {
    handlePlayer();
    showPWABanner();
  }, [showPWABanner, handlePlayer]);

  return (
    <Router>
      <div className=' App__main'>
        {showInstallPlaceholder ? (
          <div
            className={`install ${showInstallBanner ? 'install--active' : ''}`}
          >
            <div className='install__close'>
              <div data-img data-imgname='close' onClick={dismissPWA} />
            </div>
            <div className='install__content'>
              <div className='install__content__head'>Muse</div>
              <div className='install__content__body'>
                Find music you love faster with our free app.
              </div>
            </div>
            <div className='install__button' onClick={installPWA}>
              Install
            </div>
          </div>
        ) : null}
        <Nav />
        <NowPlaying
          ref={{
            playerRef,
            playerCompRef
          }}
          path={location.pathname}
          queuePlayBtnRef={queuePlayBtnRef}
        />
        <Switch>
          <Route exact path='/play/:playId?' render={() => null} />
          <Route exact path='/' render={() => <Redirect to='/play' />} />
          <Route
            exact
            path='/queues'
            render={(props) => (
              <Queues
                {...props}
                ref={{
                  playerRef,
                  queuePlayBtnRef
                }}
              />
            )}
          />
          <Route
            exact
            path='/albums'
            render={(props) => <Albums {...props} />}
          />
          <Route
            exact
            path='/artist'
            render={(props) => <Artist {...props} />}
          />
          <Route
            exact
            path='/playlists'
            render={(props) => <PlayLists {...props} />}
          />
          <Route exact path='/genre' render={(props) => <Genre {...props} />} />{' '}
          <Route
            exact
            path='/search'
            render={(props) => <Search {...props} />}
          />{' '}
          <Route
            exact
            path='/settings'
            render={(props) => <Settings {...props} />}
          />
          <Route
            exact
            path='/view/:cat/:catName/:catId'
            render={(props) => <View {...props} />}
          />
          <Route component={NoMatch} />
        </Switch>
      </div>
    </Router>
  );
};

export default Home;
// export default withRouter(Home);
