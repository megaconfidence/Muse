import React from 'react';
import ViewLanding from '../components/ViewLanding';

function View({location, songs}) {
    const path = location.pathname.replace('/view/', '');
  return (
      <div className='view'>
        <ViewLanding path={path} songs={songs}/>
      </div>
  );
}

export default View;
