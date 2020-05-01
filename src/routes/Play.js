import React, { useCallback, useEffect } from 'react';

function Play({ location, setPlayingData }) {
  const data = location.data;
  const path = location.pathname.replace('/play/', '');

  const uploadSetPlayingData = useCallback(() => {
    setPlayingData(data, path);
  }, [data, path, setPlayingData]);

  useEffect(() => {
    uploadSetPlayingData();
  }, [uploadSetPlayingData]);

  return <div className='play'></div>;
}

export default Play;
