import React from 'react';
import SigninLanding from '../components/SigninLanding';

function Signin({showPWABanner}) {
  return (
   <SigninLanding showPWABanner={showPWABanner} />
  );
}

export default Signin;
