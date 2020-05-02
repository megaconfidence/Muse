import './Nav.css';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from './hooks/AppContext';

function Nav() {
  const [{ playing }] = useContext(AppContext);
  return (
    <div className='nav'>
      <NavLink
        exact
        to={`/queues`}
        activeClassName='nav__link--active'
        className='nav__link'
      >
        <div data-img data-imgname='queue' />
      </NavLink>
      <NavLink
        to={`/play/${playing._id || ''}`}
        activeClassName='nav__link--active'
        className='nav__link'
      >
        <div data-img data-imgname='play_circle' />
      </NavLink>
      <NavLink
        exact
        to={`/artist`}
        activeClassName='nav__link--active'
        className='nav__link'
      >
        <div data-img data-imgname='artist' />
      </NavLink>
      <NavLink
        exact
        to={`/albums`}
        activeClassName='nav__link--active'
        className='nav__link'
      >
        <div data-img data-imgname='album' />
      </NavLink>
      <NavLink
        exact
        to={`/playlists`}
        activeClassName='nav__link--active'
        className='nav__link'
      >
        <div data-img data-imgname='playlist' />
      </NavLink>
      <NavLink
        exact
        to={`/genre`}
        activeClassName='nav__link--active'
        className='nav__link'
      >
        <div data-img data-imgname='tag' />
      </NavLink>{' '}
      <NavLink
        exact
        to={`/search`}
        activeClassName='nav__link--active'
        className='nav__link'
      >
        <div data-img data-imgname='search' />
      </NavLink>
      <NavLink
        exact
        to={`/settings`}
        activeClassName='nav__link--active'
        className='nav__link'
      >
        <div data-img data-imgname='menu' />
      </NavLink>
    </div>
  );
}

export default Nav;
