import React from 'react';
import './PlayList.css';
import { Link } from 'react-router-dom';
function PlayList() {
  return (
    <div className='playList'>
      <div className='playList__cat'>
        <ul>
          <Link
            to={{
              pathname: `/view/songs/all songs`
            }}
          >
            <li>
              <div data-img data-imgname='all_songs' />
              <div className='playList__cat__name'>All songs</div>
            </li>
          </Link>
          <li>
            <div data-img data-imgname='like_fill' />
            <div className='playList__cat__name'>Favorites</div>
          </li>
          <li>
            <div data-img data-imgname='clock' />
            <div className='playList__cat__name'>Recently played</div>
          </li>
          <li>
            <div data-img data-imgname='fire' />
            <div className='playList__cat__name'>Most played</div>
          </li>
          <li>
            <div data-img data-imgname='cancel' />
            <div className='playList__cat__name'>Not played</div>
          </li>
        </ul>
      </div>
      <div className='playList__user'>
        <div className='playList__user__title'>Your playlists</div>
        <ul>
          <li>
            <div data-img data-imgname='list' />
            <div className='playList__user__name'>Happy</div>
          </li>
          <li>
            <div data-img data-imgname='list' />
            <div className='playList__user__name'>Sad</div>
          </li>
        </ul>
        <div className='playList__user__create'>
          <div data-img data-imgname='plus' />
          <div className='playList__user__create__name'>
            Create a new playlist
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayList;
