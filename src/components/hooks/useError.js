import React, { useState } from 'react';
import './useError.css';

const useError = (content, action) => {
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(!showModal);
  };

  const Modal = () => {
    if (showModal) {
      return (
        <div className='error'>
          <div className='error__wrapper ' onClick={closeModal}></div>

          <div className='error__card'>
            <div className='error__card__main'>
              <div className='error__card__main__icon'>
                <div data-img data-imgname='alert' />
              </div>
              <div className='error__card__main__text'>{content}</div>
            </div>
            <div className='error__card__footer'>
              <div className='error__card__footer__buttons'>
                <div
                  className='error__card__footer__buttons__left'
                  onClick={closeModal}
                >
                  back
                </div>
                <div
                  className='error__card__footer__buttons__right'
                  onClick={() => {
                    if (action) {
                      action();
                    }
                    closeModal();
                  }}
                >
                  try again
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null
  };

  return [Modal, setShowModal];
};

export default useError;
