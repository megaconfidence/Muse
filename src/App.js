import React from 'react';
import './App.css';
import Nav from './components/Nav';
import { Route, Switch, HashRouter as Router } from 'react-router-dom';
import Player from './routes/Player';
import Queues from './routes/Queues';
import Albums from './routes/Albums';
import Artist from './routes/Artist';
import Folders from './routes/Folders';
import PlayLists from './routes/PlayList';
import Tags from './routes/Tags';
import NoMatch from './routes/NoMatch';
import apiData from './data.json';
import View from './routes/View';

function App() {
  const { data } = apiData;
  const songs = data;
  const albums = [];
  for (const artist in songs) {
    albums.push(songs[artist]);
  }

  return (
    <Router>
      <div className='App'>
        <Nav />
        <Switch>
          <Route exact path='/' render={props => <Player {...props} />} />
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
            path='/folders'
            render={props => <Folders {...props} />}
          />
          <Route
            exact
            path='/playlists'
            render={props => <PlayLists {...props} />}
          />
          <Route exact path='/tags' render={props => <Tags {...props} />} />
          <Route
            exact
            path='/view/:category/:viewId'
            render={props => <View {...props} songs={songs} />}
          />
          <Route component={NoMatch} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
