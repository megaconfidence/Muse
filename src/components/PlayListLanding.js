import './PlayListLanding.css';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ObjectID from 'bson-objectid';

function PlayListLanding({ playList, createPlayList, getPlayList }) {
  useEffect(() => {
    getPlayList();
  }, [getPlayList]);

  return (
    <div className='playList'>
      <div className='playList__cat'>
        <ul>
          {/* <li>
            <div data-img data-imgname='all_songs' />
            <div className='playList__cat__name'>All songs</div>
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
          </li> */}
          <Link
            to={{
              pathname: `/view/favorites/favorites/${ObjectID()}`
            }}
          >
            <li>
              <div data-img data-imgname='like_fill' />
              <div className='playList__cat__name'>Favorites</div>
            </li>
          </Link>
          <Link
            to={{
              pathname: `/view/recents/Recently played/${ObjectID()}`
            }}
          >
            <li>
              <div data-img data-imgname='clock' />
              <div className='playList__cat__name'>Recently played</div>
            </li>
          </Link>
        </ul>
      </div>
      <div className='playList__user'>
        <div className='playList__user__title'>Your playlists</div>
        <ul>
          {playList.length
            ? playList.map((p, k) => (
                <Link
                  key={k}
                  to={{
                    pathname: `/view/playlist/${p.name}/${p._id}`
                  }}
                >
                  <li>
                    <div data-img data-imgname='list' />
                    <div className='playList__user__name'>{p.name}</div>
                  </li>
                </Link>
              ))
            : ''}
          {/* <li>
            <div data-img data-imgname='list' />
            <div className='playList__user__name'>Happy</div>
          </li>
          <li>
            <div data-img data-imgname='list' />
            <div className='playList__user__name'>Sad</div>
          </li> */}
        </ul>
        <div
          className='playList__user__create'
          onClick={() => {
            createPlayList();
          }}
        >
          <div data-img data-imgname='plus' />
          <div className='playList__user__create__name'>
            Create a new playlist
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayListLanding;
