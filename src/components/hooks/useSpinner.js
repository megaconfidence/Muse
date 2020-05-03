import './useSpinner.css';
import React, { useState } from 'react';

const useSpinner = (defaultState) => {
  const [isLoading, setIsLoading] = useState(defaultState);

  const Spinner = () => {
    if (isLoading) {
      return (
        <div className='spinner__loader'>
          <div data-img data-imgname='loading' />
        </div>
      );
    }
    return null;
  };

  return [Spinner, setIsLoading];
};
export default useSpinner;
