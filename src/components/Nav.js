import './Nav.css';
import React from 'react';

function Nav() {
  return (
    <div className='nav'>
      <div className='nav__link'>
        <div data-img data-imgname='playlist' />
      </div>
      <div className='nav__link nav__link--active'>
        <div data-img data-imgname='play_circle' />
      </div>
      <div className='nav__link'>
        <div data-img data-imgname='artist' />
      </div>
      <div className='nav__link'>
        <div data-img data-imgname='folder' />
      </div>
      <div className='nav__link'>
        <div data-img data-imgname='disk' />
      </div>
      <div className='nav__link'>
        <div data-img data-imgname='album' />
      </div>
      <div className='nav__link'>
        <div data-img data-imgname='tag' />
      </div>
      <div className='nav__link'>
        <div data-img data-imgname='menu' />
      </div>
    </div>
  );
}

export default Nav;
