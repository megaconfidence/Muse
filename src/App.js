import React from 'react';
import './App.css';
import Nav from './components/Nav';
import {
  Link,
  Route,
  Switch,
  Redirect,
  HashRouter as Router
} from 'react-router-dom';
import Player from './routes/Player';
import Queues from './routes/Queues';
import Albums from './routes/Albums';
import Artist from './routes/Artist';
import Folders from './routes/Folders';
import PlayLists from './routes/PlayList';
import Tags from './routes/Tags';
import NoMatch from './routes/NoMatch';

function App() {
  return (
    <Router>
      <div className='App'>
        <Nav />
        <Switch>
          <Route exact path='/' render={props => <Player {...props} />} />
          <Route exact path='/queues' render={props => <Queues {...props} />} />
          <Route exact path='/albums' render={props => <Albums {...props} />} />
          <Route exact path='/artist' render={props => <Artist {...props} />} />
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
          <Route component={NoMatch} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
