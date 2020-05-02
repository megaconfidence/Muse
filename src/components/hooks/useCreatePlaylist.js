import React, { useState, useCallback } from 'react';
import './useCreatePlaylist.css';
import { useSnackbar } from 'notistack';
import config from 'environment';
import ObjectID from 'bson-objectid';
import { useContext } from 'react';
import AppContext from './AppContext';
import request from '../../helpers';

const useCreatePlaylist = () => {
  const [name, setName] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const [showModal, setShowModla] = useState(false);
  const [appData, setAppData] = useContext(AppContext);
  const handleInputChange = ({ target }) => {
    setName(target.value);
  };

  const syncSavedPlayList = useCallback(async () => {
    try {
      const pList = JSON.parse(
        localStorage.getItem(`${config.appName}_PLAYLIST`)
      );

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
      if (pList) {
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

  const createPlayList = useCallback(
    async (name) => {
      if (name) {
        try {
          const fakePayload = {
            songs: [],
            name: name.trim(),
            _id: `_${ObjectID()}`
          };

          const newPl = {
            ...fakePayload
          };

          const plList = JSON.parse(
            localStorage.getItem(`${config.appName}_PLAYLIST`)
          );

          if (plList) {
            plList.push(newPl);
            localStorage.setItem(
              `${config.appName}_PLAYLIST`,
              JSON.stringify(plList)
            );
            setAppData({ ...appData, playlist: plList });
          } else {
            localStorage.setItem(
              `${config.appName}_PLAYLIST`,
              JSON.stringify([newPl])
            );
            setAppData({ ...appData, playlist: [newPl] });
          }
          enqueueSnackbar('Playlist created');
          setShowModla(!showModal);
          syncSavedPlayList();
        } catch (err) {
          console.log(err);
          enqueueSnackbar("Couldn't create playlist");
          setShowModla(!showModal);
        }
      }
    },
    [appData, enqueueSnackbar, setAppData, showModal, syncSavedPlayList]
  );

  const Modal = () => {
    if (showModal) {
      return (
        <div className='crPlayList__modal'>
          <div
            className='crPlayList__modal__wrapper '
            onClick={() => {
              setShowModla(!showModal);
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
                autoFocus
                type='text'
                value={name}
                onChange={handleInputChange}
                placeholder='Name of playlist'
                className='crPlayList__modal__card__body__input'
              />

              <div className='crPlayList__modal__card__body__controls'>
                <div
                  className='crPlayList__modal__card__body__controls__cancel'
                  onClick={() => {
                    setShowModla(!showModal);
                  }}
                >
                  cancel
                </div>
                <div
                  className='crPlayList__modal__card__body__controls__ok'
                  style={{
                    opacity: name.length ? '1' : '0.4',
                    pointerEvents: name.length ? 'initial' : 'none'
                  }}
                  onClick={() => {
                    createPlayList(name);
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

  return [Modal, setShowModla];
};

export default useCreatePlaylist;
