import React from 'react';
import { useContext } from 'react';
import AppContext from './hooks/AppContext';
import { Redirect } from 'react-router-dom';
import config from 'environment';


const Protect = ({ location, children }) => {

  const [{ user }] = useContext(AppContext);
  if (Object.keys(user).length) {
    return children;
  }
  localStorage.setItem(`${config.appName}_REDIRECT`, JSON.stringify(location.pathname))
  return <Redirect to='/signin' />;
};
export default Protect;
