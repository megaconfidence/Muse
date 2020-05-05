import Home from './Home';
import config from 'environment';
import Signin from './routes/Signin';
import { useSnackbar } from 'notistack';
import Protect from './components/Protect';
import AppContext from './components/hooks/AppContext';
import defaultContext from './components/hooks/defaultContext';
import { Route, HashRouter as Router, Switch } from 'react-router-dom';
import React, { useState, useRef, useEffect, useCallback } from 'react';

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

  const playerRef = useRef(null);
  const deferredPrompt = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showInstallPlaceholder, setShowInstallPlaceholder] = useState(false);

  const showPWABanner = useCallback(() => {
    const isPWAInstalled = JSON.parse(localStorage.getItem(
      `${config.appName}_PWA_PROMPT_RESPONDED`
    ));
    setTimeout(() => {
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
    }, 3000);
  }, [playerRef]);

  const installPWA = useCallback(() => {
    setShowInstallBanner(false);
    setShowInstallPlaceholder(false);
    if (deferredPrompt.current) {
      deferredPrompt.current.prompt();
      deferredPrompt.current.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          localStorage.setItem(`${config.appName}_PWA_PROMPT_RESPONDED`, JSON.stringify(true));
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
    localStorage.setItem(`${config.appName}_PWA_PROMPT_RESPONDED`, JSON.stringify(true));
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
    showPWABanner();
  }, [showPWABanner]);

  return (
    <AppContext.Provider value={appData}>
      <Router>
        <div className='App'>
          <Switch>
            <Route
              exact
              path='/signin'
              render={(props) => (
                <Signin {...props} showPWABanner={showPWABanner} />
              )}
            />
            <Route
              path='/'
              render={(props) => (
                <Protect
                  {...props}
                  children={
                    <Home
                      ref={{ playerRef }}
                      installPWA={installPWA}
                      dismissPWA={dismissPWA}
                      showInstallBanner={showInstallBanner}
                      showInstallPlaceholder={showInstallPlaceholder}
                    />
                  }
                />
              )}
            />
          </Switch>
        </div>
      </Router>
    </AppContext.Provider>
  );
};

export default App;
// export default withRouter(App);
