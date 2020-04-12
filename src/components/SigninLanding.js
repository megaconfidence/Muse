import React, { useEffect, useState, useCallback } from 'react';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { useSnackbar } from 'notistack';
import request from '../helpers';
import config from 'environment';
import './SigninLanding.css';
import { Redirect } from 'react-router-dom';

function SigninLanding() {
  const { enqueueSnackbar } = useSnackbar();
  const [redirectTo, setRedirectTo] = useState(null);

  const saveToken = async (access_token, provider) => {
    try {
      const payload = {
        access_token
      };
      const {
        data: { token }
      } = await request('post', `signin/${provider}`, payload);

      localStorage.setItem(`${config.appName}_TOKEN`, token);
      enqueueSnackbar('Welcome 😜');
      setRedirectTo('/play');
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
    if (localStorage.getItem(`${config.appName}_TOKEN`)) {
      setTimeout(() => {
        setRedirectTo('/play');
      }, 2000);
    }
    return () => {};
  }, []);

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
          render={renderProps => (
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
          render={renderProps => (
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
      {redirectTo ? <Redirect to={redirectTo} /> : null}
    </div>
  );
}

export default SigninLanding;
