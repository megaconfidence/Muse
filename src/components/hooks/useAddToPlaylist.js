import React from 'react';
import './useAddToPlaylist.css';
import { useState, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import config from 'environment';
import { useContext } from 'react';
import AppContext from './AppContext';
import request from '../../helpers';
import useCreatePlaylist from './useCreatePlaylist';

const useAddToPlaylist = () => {
  const [showModal, setShowModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [appData, setAppData] = useContext(AppContext);
  const [song, setSong] = useState({});
  const [type, setType] = useState('single');
  const [CreatePLModal, showCreatePLModal] = useCreatePlaylist();


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

  const saveToPlayList = useCallback(
    (list, i, update) => {
      list.splice(i, 1, update);
      localStorage.setItem(`${config.appName}_PLAYLIST`, JSON.stringify(list));
      setAppData({ ...appData, playlist: list });
      syncSavedPlayList();
    },
    [appData, setAppData, syncSavedPlayList]
  );

  const addToPlayList = useCallback(
    (id, song, type) => {
      if (id && song && type) {
        const pList = JSON.parse(
          localStorage.getItem(`${config.appName}_PLAYLIST`)
        );
        if (pList) {
          if (type === 'single') {
            let isSongInList = false;
            for (const p in pList) {
              if (pList[p]._id === id) {
                for (const s in pList[p].songs) {
                  if (
                    song._id === pList[p].songs[s]._id 
                  ) {
                    isSongInList = true;
                    enqueueSnackbar(`Song is already in '${pList[p].name}'`);
                  }
                }
                if (!isSongInList) {
                  delete song.cat;
                  delete song.catId;
                  delete song.queueId;
                  delete song.catName;
                  pList[p].songs.push(song);
                  saveToPlayList(pList, p, pList[p]);
                  enqueueSnackbar(`Added song to '${pList[p].name}'`);
                }
              }
            }
          } else if (type === 'multiple') {
            for (const p in pList) {
              if (pList[p]._id === id) {
                const list = [];
                const tpList = pList[p].songs.concat(song);

                const map = new Map();
                for (const item of tpList) {
                  if (!map.has(item.name)) {
                    map.set(item.name, true);
                    delete song.cat;
                    delete song.catId;
                    delete song.queueId;
                    delete song.catName;
                    list.push({
                      ...item
                    });
                  }
                }

                const obj = {
                  ...pList[p],
                  songs: list
                };

                saveToPlayList(pList, p, obj);
                enqueueSnackbar(`Added songs to '${pList[p].name}'`);
              }
            }
          }
        }
      }
    },
    [enqueueSnackbar, saveToPlayList]
  );

  const setUpHook = (song, type) => {
    setSong(song);
    setType(type);
    setShowModal(true);
  };

  const Modal = () => {
    if (showModal) {
      return (
        <div className='atPlayList__modal'>
            <CreatePLModal />
          <div
            className='atPlayList__modal__wrapper '
            onClick={() => {
              setShowModal(!showModal);
            }}
          ></div>

          <div className='atPlayList__modal__card'>
            <div className='atPlayList__modal__card__head'>
              <div className='atPlayList__modal__card__head__text'>
                Select a playlist
              </div>
            </div>
            <div className='atPlayList__modal__card__body'></div>
            <div className='atPlayList__modal__card__body'>
              <div
                className='atPlayList__modal__card__body__item atPlayList__modal__card__body__item--new'
                onClick={() => {
                    showCreatePLModal(true)
                }}
              >
                + New Playlist
              </div>
              {appData.playlist.map((p, k) => (
                <div
                  key={k}
                  className='atPlayList__modal__card__body__item'
                  onClick={() => {
                    setShowModal(!showModal);
                    addToPlayList(p._id, song, type);
                  }}
                >
                  {k + 1}. {p.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return [Modal, setUpHook];
};

export default useAddToPlaylist;
