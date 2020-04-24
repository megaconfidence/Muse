import React, { useRef, forwardRef, useState } from 'react';
import './RenamePlayList.css';

const RenamePlayList = forwardRef(({ renamePlayList }, ref) => {
  const [name, setName] = useState({ val: '' });
  const handleInputChange = ({ target }) => {
    setName({ val: target.value });
  };
  return (
    <div className='rnPlayList__modal hide' ref={ref}>
      <div
        className='rnPlayList__modal__wrapper '
        onClick={() => {
          ref.current.classList.toggle('hide');
        }}
      ></div>

      <div className='rnPlayList__modal__card'>
        <div className='rnPlayList__modal__card__head'>
          <div className='rnPlayList__modal__card__head__text'>
            Enter new name
          </div>
        </div>
        <div className='rnPlayList__modal__card__body'>
          <input
            type='text'
            value={name.val}
            onChange={handleInputChange}
            placeholder='Enter new name'
            className='rnPlayList__modal__card__body__input'
          />

          <div className='rnPlayList__modal__card__body__controls'>
            <div
              className='rnPlayList__modal__card__body__controls__cancel'
              onClick={() => {
                ref.current.classList.toggle('hide');
              }}
            >
              cancel
            </div>
            <div
              className='rnPlayList__modal__card__body__controls__ok'
              style={{
                opacity: name.val.length ? '1' : '0.4',
                pointerEvents: name.val.length ? 'initial' : 'none'
              }}
              onClick={() => {
                renamePlayList(name.val);
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
export default RenamePlayList;
