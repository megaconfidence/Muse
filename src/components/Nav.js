import './Nav.css';
import React from 'react';
import { NavLink } from 'react-router-dom';

function Nav() {
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
        exact
        to={`/`}
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
        to={`/folders`}
        activeClassName='nav__link--active'
        className='nav__link'
      >
        <div data-img data-imgname='folder' />
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
        to={`/tags`}
        activeClassName='nav__link--active'
        className='nav__link'
      >
        <div data-img data-imgname='tag' />
      </NavLink>
      <div className='nav__link'>
        <div data-img data-imgname='menu' />
      </div>
    </div>
  );
}

export default Nav;