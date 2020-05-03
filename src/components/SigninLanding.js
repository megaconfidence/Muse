import React, { useEffect, useState, useContext } from 'react';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { useSnackbar } from 'notistack';
import request from '../helpers';
import config from 'environment';
import './SigninLanding.css';
import { Redirect } from 'react-router-dom';
import AppContext from './hooks/AppContext';
import defaultContext from './hooks/defaultContext';

const SigninLanding = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [redirect, setRedirect] = useState(false);
  const [appData, setAppData] = useContext(AppContext);

  const syncUserData = async (user) => {
    try {
      const likesData = await request('get', 'api/like');
      console.log(likesData);
      const likes = likesData.data.data[0];

      if (likes && likes.songs) {
        localStorage.setItem(
          `${config.appName}_LIKESID`,
          JSON.stringify(likes._id)
        );
        localStorage.setItem(
          `${config.appName}_LIKES`,
          JSON.stringify(likes.songs)
        );
      }

      const pListData = await request('get', 'api/playlist');
      console.log(pListData);

      const playlist = pListData.data.data[0];
      if (playlist && playlist.songs) {
        localStorage.setItem(
          `${config.appName}_PLAYLIST`,
          JSON.stringify(playlist.songs)
        );
      }

      const queueData = await request('get', `api/queue/`);
      console.log(queueData);
      const queue = queueData.data.data[0];
      if (queue && queue.songs) {
        localStorage.setItem(
          `${config.appName}_QUEUEID`,
          JSON.stringify(queue._id)
        );
        localStorage.setItem(
          `${config.appName}_QUEUES`,
          JSON.stringify(queue.songs)
        );
      }

      enqueueSnackbar('Welcome 😜');
      setAppData({
        ...appData,
        user,
        likes: likes ? likes.song : [],
        queue: queue ? queue.songs : [],
        playlist: playlist ? playlist.songs : []
      });
      const redirect = JSON.parse(
        localStorage.getItem(`${config.appName}_REDIRECT`)
      );
      if (redirect) {
        localStorage.removeItem(`${config.appName}_REDIRECT`);
        setRedirect(redirect);
      } else {
        setRedirect('/play/');
      }
    } catch (err) {
      console.log(err);
    }
  };
  const saveToken = async (access_token, provider) => {
    try {
      const payload = {
        access_token
      };
      const {
        data: { token }
      } = await request('post', `signin/${provider}`, payload);

      localStorage.setItem(`${config.appName}_TOKEN`, token);

      const user = await request('get', 'api/user');
      const userData = user.data.data;
      setAppData({ ...defaultContext, user: userData });
      localStorage.setItem(`${config.appName}_USER`, JSON.stringify(userData));

      syncUserData(userData);
    } catch (err) {
      enqueueSnackbar('Something went wrong 😢');
    }
  };

  const responseGoogle = ({ accessToken }) => {
    saveToken(accessToken, 'google');
  };

  const responseFacebook = ({ accessToken }) => {
    saveToken(accessToken, 'facebook');
  };

  useEffect(() => {
    // if (localStorage.getItem(`${config.appName}_TOKEN`)) {
    //   setTimeout(() => {
    //     setRedirect(true);
    //   }, 2000);
    // }
  }, []);

  if (redirect) {
    return <Redirect to={redirect} />;
  }

  return (
    <div className='sLanding'>
      <div className='sLanding__head'>
        <div className='sLanding__head__main'>
          You bring the passion. <br />
          We bring the music.
        </div>
        <div className='sLanding__head__helper'>Sign in to begin</div>
      </div>
      <div className='sLanding__social'>
        <GoogleLogin
          clientId={process.env.REACT_APP_google_client_id}
          render={(renderProps) => (
            <button
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              className='sLanding__social__btn sLanding__social__btn--google'
            >
              Google
            </button>
          )}
          buttonText='Login'
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
        />

        <FacebookLogin
          appId={process.env.REACT_APP_facebook_client_id}
          autoLoad={false}
          callback={responseFacebook}
          disableMobileRedirect={true}
          fields='name,email,picture'
          render={(renderProps) => (
            <button
              onClick={renderProps.onClick}
              className='sLanding__social__btn sLanding__social__btn--facebook'
            >
              Facebook
            </button>
          )}
        />
      </div>
      <div className='sLanding__info'>
        <div className='sLanding__info__img'></div>
        <div className='sLanding__info__heading'>Why Muse?</div>
        <div className='sLanding__info__section'>
          <div className='sLanding__info__section__head'>
            A world of music in your pocket.
          </div>
          <div className='sLanding__info__section__body'>
            Find new loves and old favourites from over 56 million tracks.
          </div>
        </div>
        <div className='sLanding__info__section'>
          <div className='sLanding__info__section__head'>
            No WiFi? No problem.
          </div>
          <div className='sLanding__info__section__body'>
            With Muse you don't need to be connected to enjoy your favourite
            tracks.
          </div>
        </div>
        <div className='sLanding__info__section'>
          <div className='sLanding__info__section__head'>
            Craft your collection.
          </div>
          <div className='sLanding__info__section__body'>
            Create playlists from millions of tracks and take them with you
            wherever you go.
          </div>
        </div>
        <div className='sLanding__info__section'>
          <div className='sLanding__info__section__head'>Made for you.</div>
          <div className='sLanding__info__section__body'>
            Flow gets to know what you like and what you don't. Discover your
            personal soundtrack.
          </div>
        </div>
      </div>

      <div className='sLanding__devices'>
        <div className='sLanding__devices__head'>Always with you</div>
        <div className='sLanding__devices__body'>
          Download your music and take it from your morning run to dinner out
          with Muse. Available on all your devices, all the time, even without
          WiFi or 4G.
        </div>
        <div className='sLanding__devices__items'>
          <div data-img data-imgname='laptop' />
          <div data-img data-imgname='watch' />
          <div data-img data-imgname='mobile' />
          <div data-img data-imgname='speakers' />
          <div data-img data-imgname='voice' />
          <div data-img data-imgname='tv' />
          <div data-img data-imgname='car' />
        </div>
      </div>
      <div className='sLanding__footer'>
        <div className='sLanding__footer__text'>
          <div className='sLanding__footer__text__img' />
          <div className='sLanding__footer__text__txt'>Muse</div>
        </div>
        <div className='sLanding__footer__bottom'>© 2020 Muse</div>
      </div>
    </div>
  );
};

export default SigninLanding;
