import {
  Route,
  Switch,
  Redirect,
  withRouter,
  HashRouter as Router
} from 'react-router-dom';
import './App.css';
import View from './routes/View';
import Nav from './components/Nav';
import Genre from './routes/Genre';
import Queues from './routes/Queues';
import Albums from './routes/Albums';
import Artist from './routes/Artist';
import Search from './routes/Search';
import NoMatch from './routes/NoMatch';
import PlayLists from './routes/PlayList';
import Settings from './routes/Settings';
import NowPlaying from './components/NowPlaying';
import React, { useRef, useEffect, useCallback, forwardRef } from 'react';

const withRouterAndRef = (Wrapped) => {
  const WithRouter = withRouter(({ forwardRef, ...otherProps }) => (
    <Wrapped ref={forwardRef} {...otherProps} />
  ));
  const WithRouterAndRef = forwardRef((props, ref) => (
    <WithRouter {...props} forwardRef={ref} />
  ));
  const name = Wrapped.displayName || Wrapped.name;
  WithRouterAndRef.displayName = `withRouterAndRef(${name})`;
  return WithRouterAndRef;
};

const Home = forwardRef(
  (
    {
      location,
      history,
      installPWA,
      dismissPWA,
      showInstallBanner,
      showInstallPlaceholder
    },
    ref
  ) => {
    const { playerRef } = ref;
    const playerCompRef = useRef(null);
    const queuePlayBtnRef = useRef(null);

    const handlePlayer = useCallback(() => {
      const togglePlayer = () => {
        if (playerCompRef.current) {
          const path = location.pathname;
          if (path.includes('/play/') || path.endsWith('/play')) {
            playerCompRef.current.classList.remove('hide');
          } else {
            playerCompRef.current.classList.add('hide');
          }
        }
      };
      togglePlayer();
      history.listen((location) => {
        togglePlayer();
      });
    }, [history, location.pathname]);

    // console.log('test console.log');

    useEffect(() => {
      handlePlayer();
    }, [handlePlayer]);

    return (
      <Router>
        <div className=' App__main'>
          {showInstallPlaceholder ? (
            <div
              className={`install ${
                showInstallBanner ? 'install--active' : ''
              }`}
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
            <Route
              exact
              path='/genre'
              render={(props) => <Genre {...props} />}
            />{' '}
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
  }
);

// export default Home;
export default withRouterAndRef(Home);
