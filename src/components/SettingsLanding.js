import './SettingsLanding.css';
import { useSnackbar } from 'notistack';
import AppContext from './hooks/AppContext';
import colorLog from '../helpers/colorLog';
import { Redirect } from 'react-router-dom';
import defaultContext from './hooks/defaultContext';
import React, { useState, useContext } from 'react';

const SettingsLanding = () => {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [{ user }, setAppData] = useContext(AppContext);

  const logout = () => {
    localStorage.clear();
    setIsLoggedOut(true);
    setAppData(defaultContext);
  };

  const share = () => {
    const link = window.location.origin;
    if (navigator.share) {
      navigator
        .share({
          url: link,
          title: 'Muse',
          text: 'Check out Muse.'
        })
        .then(() => colorLog('Successful share', 'success'))
        .catch((error) => colorLog('Error sharing', 'error'));
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(link).then(
        () => {
          enqueueSnackbar('Copied link to clipboard');
        },
        (err) => {
          console.log(err);
          enqueueSnackbar('Could not share');
        }
      );
    } else {
      enqueueSnackbar('Could not share');
    }
  };
  // useEffect(() => {
  // getUser();
  // }, [getUser]);

  if (isLoggedOut) {
    return <Redirect to='/signin' />;
  }

  return (
    <div className='stLanding'>
      <div className='stLanding__cover'>
        <div className='stLanding__cover__temp'>
          <div
            className='stLanding__cover__img'
            style={{ backgroundImage: `url(${user.profileImageURL})` }}
          />
        </div>
      </div>
      <div className='stLanding__section'>
        <div className='stLanding__section__title'>Name</div>
        <div className='stLanding__section__value'>{user.name}</div>
      </div>{' '}
      <div className='stLanding__section'>
        <div className='stLanding__section__title'>Email</div>
        <div className='stLanding__section__value'>{user.email}</div>
      </div>
      <div className='stLanding__controls'>
        <div
          className='stLanding__controls__btn stLanding__controls__btn--share noselect'
          onClick={share}
        >
          Share Muse
        </div>
        <div
          className='stLanding__controls__btn  stLanding__controls__btn--logout noselect'
          onClick={logout}
        >
          Logout
        </div>
      </div>
    </div>
  );
};

export default SettingsLanding;
