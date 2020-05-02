import React, { useCallback } from 'react';
import './useFilterModal.css';
import { useState } from 'react';
import { useRef } from 'react';

const useFilterModal = () => {
  const [showModal, setShowModal] = useState(false);
  const pageFunc = useRef(null);
  const [pageData, setPageData] = useState([]);
  const shuffle = (array) => {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  };
  const order = (array) => {
    return array.sort((a, b) =>
      a.name > b.name ? 1 : a.name === b.name ? (a._id > b._id ? 1 : -1) : -1
    );
  };

  const filterList = useCallback(
    (type) => {
      const arr = pageData.map((d) => d);
      if (type === 'randomize') {
        pageFunc.current(shuffle(arr));
      } else if (type === 'reverse') {
        pageFunc.current(arr.reverse());
      } else if (type === 'ascending') {
        pageFunc.current(order(arr));
      } else if (type === 'desending') {
        pageFunc.current(order(arr).reverse());
      }
      setShowModal(false);
    },
    [pageData]
  );

  const setUpHook = (pageState, setPageState) => {
    setShowModal(true);
    setPageData(pageState);
    pageFunc.current = setPageState;
  };

  const Modal = () => {
    // if (showModal) {
    return (
      <div className={`fModal ${showModal ? '' : 'hide'}`}>
        <div
          className='fModal__wrapper '
          onClick={() => {
            setShowModal(!showModal);
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
                filterList('randomize');
              }}
            >
              Randomize
            </div>
            <div
              className='fModal__card__body__item'
              onClick={() => {
                filterList('reverse');
              }}
            >
              Reverse
            </div>
            <div
              className='fModal__card__body__item'
              onClick={() => {
                filterList('ascending');
              }}
            >
              Ascending
            </div>
            <div
              className='fModal__card__body__item'
              onClick={() => {
                filterList('desending');
              }}
            >
              Desending
            </div>
          </div>
        </div>
      </div>
    );
    // }
    // return null;
  };
  return [Modal, setUpHook];
};

export default useFilterModal;
