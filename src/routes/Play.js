import React, { useCallback, useEffect } from 'react';

function Play({ location, songs, setPlayingData, setPlayPathData }) {
  const path = location.search;
  const data = location.data;

  const uploadSetPlayingData = useCallback(() => {
    if (data) {
      setPlayingData(data);
    }
    if(path) {
      setPlayPathData(path)
    }
  }, [data, path, setPlayPathData, setPlayingData]);
  
  useEffect(() => {
    uploadSetPlayingData();
  }, [uploadSetPlayingData]);

  return (
    <div className='play'>
    </div>
  );
}

export default Play;
