import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import config from 'environment';

function Root() {
  const [redirectToSignin] = useState(() => {
    if (localStorage.getItem(`${config.appName}_TOKEN`)) {
      return { val: false };
    } else {
      return { val: true };
    }
  });

  return (
    <>
      {redirectToSignin.val ? (
        <Redirect exact from='/' to='signin' />
      ) : (
        <Redirect exact from='/' to='play' />
      )}
    </>
  );
}

export default Root;
