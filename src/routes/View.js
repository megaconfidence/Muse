import React from 'react';
import ViewLanding from '../components/ViewLanding';

const View = ({
  location,
}) => {
  const path = location.pathname.replace('/view/', '');
  return (
    <div className='view'>
      <ViewLanding
        path={path}
      />
    </div>
  );
};
export default View;
