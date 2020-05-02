import React, { useState, useCallback } from 'react';
import './useRenamePlaylist.css';
import { useContext } from 'react';
import AppContext from './AppContext';
import request from '../../helpers';
import config from 'environment';
import { useSnackbar } from 'notistack';

const useRenamePlaylist = (history) => {
  const [name, setName] = useState({ val: '' });
  const [showModal, setShowModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [temPlayListId, setTempPlayListId] = useState('');

  const [appData, setAppData] = useContext(AppContext);

  const syncSavedPlayList = useCallback(async () => {
    try {
      let pList = localStorage.getItem(`${config.appName}_PLAYLIST`);

      const toLocal = async () => {
        try {
          const data = await request('get', 'api/playlist');
          const list = data.data.data;
          localStorage.setItem(
            `${config.appName}_PLAYLIST`,
            JSON.stringify(list)
          );
          setAppData({ ...appData, playlist: list });
        } catch (err) {
          console.log(err);
        }
      };
      if (pList && pList !== 'undefined') {
        pList = JSON.parse(pList);
        for (const p in pList) {
          if (pList[p]._id.includes('_')) {
            delete pList[p]._id;
            await request('post', 'api/playlist', pList[p]);
          } else {
            const id = pList[p]._id;
            delete pList[p]._id;
            await request('put', `api/playlist/${id}`, pList[p]);
          }
          if (Number(p) === pList.length - 1) {
            toLocal();
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, [appData, setAppData]);

  const saveToPlayList = useCallback(
    (list, i, update) => {
      list.splice(i, 1, update);
      localStorage.setItem(`${config.appName}_PLAYLIST`, JSON.stringify(list));
      setAppData({ ...appData, playlist: list });
      syncSavedPlayList();
    },
    [appData, setAppData, syncSavedPlayList]
  );

  const renamePlayList = useCallback(
    (name) => {
      if (name) {
        let pList = localStorage.getItem(`${config.appName}_PLAYLIST`);
        if (pList && pList !== 'undefined') {
          pList = JSON.parse(pList);
          for (const p in pList) {
            if (pList[p]._id === temPlayListId) {
              pList[p].name = name;
              saveToPlayList(pList, p, pList[p]);
              enqueueSnackbar('Name updated');
              history.push(`/view/playlist/${name}/${temPlayListId}`);
            }
          }
        }
        setShowModal(!showModal);
      }
    },
    [enqueueSnackbar, history, saveToPlayList, showModal, temPlayListId]
  );

  const setUpHook = (id) => {
    setShowModal(true);
    setTempPlayListId(id);
    console.log('dfasdfas');
  };

  const handleInputChange = ({ target }) => {
    setName({ val: target.value });
  };
  const Modal = () => {
    if (showModal) {
      return (
        <div className='rnPlayList__modal'>
          <div
            className='rnPlayList__modal__wrapper '
            onClick={() => {
              setShowModal(!showModal);
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
                autoFocus
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
                    setShowModal(!showModal);
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
    }
    return null;
  };
  return [Modal, setUpHook];
};
export default useRenamePlaylist;
