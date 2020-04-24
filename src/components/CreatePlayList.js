import React, { useRef, forwardRef, useState } from 'react';
import './CreatePlayList.css';

const CreatePlayList = forwardRef(({ createPlayList }, ref) => {
  const [name, setName] = useState({ val: '' });
  const handleInputChange = ({ target }) => {
    setName({ val: target.value });
  };
  return (
    <div className='crPlayList__modal hide' ref={ref}>
      <div
        className='crPlayList__modal__wrapper '
        onClick={() => {
          ref.current.classList.toggle('hide');
        }}
      ></div>

      <div className='crPlayList__modal__card'>
        <div className='crPlayList__modal__card__head'>
          <div className='crPlayList__modal__card__head__text'>
            Name of playlist
          </div>
        </div>
        <div className='crPlayList__modal__card__body'>
          <input
            type='text'
            value={name.val}
            onChange={handleInputChange}
            placeholder='Name of playlist'
            className='crPlayList__modal__card__body__input'
          />

          <div className='crPlayList__modal__card__body__controls'>
            <div
              className='crPlayList__modal__card__body__controls__cancel'
              onClick={() => {
                ref.current.classList.toggle('hide');
              }}
            >
              cancel
            </div>
            <div
              className='crPlayList__modal__card__body__controls__ok'
              style={{
                opacity: name.val.length ? '1' : '0.4',
                pointerEvents: name.val.length ? 'initial' : 'none'
              }}
              onClick={() => {
                createPlayList(name.val);
                setName({ val: '' });
              }}
            >
              ok
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
export default CreatePlayList;
