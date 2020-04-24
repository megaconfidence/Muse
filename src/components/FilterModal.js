import React, { forwardRef } from 'react';
import './FilterModal.css';

const FilterModal = forwardRef(({ filterList }, ref) => {
  return (
    <div className='fModal hide' ref={ref}>
      <div
        className='fModal__wrapper '
        onClick={() => {
          ref.current.classList.toggle('hide');
        }}
      ></div>

      <div className='fModal__card'>
        <div className='fModal__card__head'>
          <div
            data-img
            data-imgname='sort'
            className='fModal__card__head__icon'
          />
          <div className='fModal__card__head__text'>Sort</div>
        </div>
        <div className='fModal__card__body'>
          <div
            className='fModal__card__body__item'
            onClick={() => {
              filterList(undefined, 'randomize');
            }}
          >
            Randomize
          </div>
          <div
            className='fModal__card__body__item'
            onClick={() => {
              filterList(undefined, 'reverse');
            }}
          >
            Reverse
          </div>
          <div
            className='fModal__card__body__item'
            onClick={() => {
              filterList(undefined, 'ascending');
            }}
          >
            Ascending
          </div>
          <div
            className='fModal__card__body__item'
            onClick={() => {
              filterList(undefined, 'desending');
            }}
          >
            Desending
          </div>
        </div>
      </div>
    </div>
  );
});

export default FilterModal;
