import React from 'react';
import { Redirect } from 'react-router-dom';

function Root() {
  return (
    <Redirect exact from="/" to="play" />
  );
}

export default Root;
