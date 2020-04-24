import React, { useState, useCallback, useEffect } from 'react';
import config from 'environment';
import './SettingsLanding.css';
import colorLog from '../helpers/colorLog';
import { Redirect } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const SettingsLanding = () => {
  const [user, setUser] = useState({ val: {} });
  const [redirectTo, setRedirectTo] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const getUser = useCallback(() => {
    const storedUser = localStorage.getItem(`${config.appName}_USER`);
    if (storedUser) {
      setUser({ val: JSON.parse(storedUser) });
    }
  }, []);
  const logout = () => {
    localStorage.removeItem(`${config.appName}_USER`);
    localStorage.removeItem(`${config.appName}_TOKEN`);
    setRedirectTo('/signin');
  };

  const share = () => {
    const link = window.location.host;
    if (navigator.share) {
      navigator
        .share({
          url: link,
          title: 'Muse',
          text: 'Check out Muse.'
        })
        .then(() => colorLog('Successful share', 'success'))
        .catch(error => colorLog('Error sharing', 'error'));
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(link).then(
        () => {
          enqueueSnackbar('Copied link to clipboard');
        },
        err => {
          console.log(err);
          enqueueSnackbar('Could not share');
        }
      );
    } else {
      enqueueSnackbar('Could not share');
    }
  };
  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <div className='stLanding'>
      <div className='stLanding__cover'>
        <div className='stLanding__cover__temp'>
          <div
            className='stLanding__cover__img'
            style={{ backgroundImage: `url(${user.val.profileImageURL})` }}
          />
        </div>
      </div>
      <div className='stLanding__section'>
        <div className='stLanding__section__title'>Name</div>
        <div className='stLanding__section__value'>{user.val.name}</div>
      </div>{' '}
      <div className='stLanding__section'>
        <div className='stLanding__section__title'>Email</div>
        <div className='stLanding__section__value'>{user.val.email}</div>
      </div>
      <div className='stLanding__controls'>
        <div
          className='stLanding__controls__btn stLanding__controls__btn--share'
          onClick={share}
        >
          Share Muse
        </div>
        <div
          className='stLanding__controls__btn  stLanding__controls__btn--logout'
          onClick={logout}
        >
          Logout
        </div>
      </div>
      {redirectTo ? <Redirect to={redirectTo} /> : null}
    </div>
  );
};

export default SettingsLanding;
