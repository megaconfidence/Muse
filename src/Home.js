import {
  Route,
  Switch,
  withRouter,
  HashRouter as Router,
  useHistory
} from 'react-router-dom';
import './App.css';
import Play from './routes/Play';
import _ from 'lodash';
import Root from './routes/Root';
import View from './routes/View';
import apiData from './data.json';
import Nav from './components/Nav';
import Genre from './routes/Genre';
import Queues from './routes/Queues';
import Albums from './routes/Albums';
import Artist from './routes/Artist';
import { useSnackbar } from 'notistack';
import PlayLists from './routes/PlayList';
import NowPlaying from './components/NowPlaying';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Signin from './routes/Signin';
import request from './helpers';
import config from 'environment';
import colorLog from './helpers/colorLog';
import Search from './routes/Search';
import Settings from './routes/Settings';
import CreatePlayList from './components/CreatePlayList';
import RenamePlayList from './components/RenamePlayList';
import AddToPlayList from './components/AddToPlayList';
import ObjectID from 'bson-objectid';
import FilterModal from './components/FilterModal';
// eslint-disable-next-line import/no-webpack-loader-syntax
import srtWorker from 'worker-loader!./sortWorker.js';
// eslint-disable-next-line import/no-webpack-loader-syntax
import schWorker from 'worker-loader!./searchWorker.js';
import SongModal from './components/SongModal';
import SongInfoModal from './components/SongInfoModal';

const Home = withRouter(({ location, history }) => {
  const { data } = apiData;
  const songs = data;
  const playerCompRef = useRef(null);
  const playerRef = useRef(null);
  const queuePlayBtnRef = useRef(null);
  const createPlayListRef = useRef(null);
  const filterModalRef = useRef(null);
  const renamePlayListRef = useRef(null);
  const addToPlayListRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const [playing, setPlaying] = useState({ val: {} });
  const [playPath, setPlayPath] = useState({ val: '' });
  const [playList, setPlayList] = useState({ val: [] });
  const [stagedSong, setStagedSong] = useState({ val: {} });
  const [addTPLType, setAddTPLType] = useState({ val: '' });
  const [temPlayListId, setTempPlayListId] = useState({ val: '' });

  const [songQueues, setSongQueues] = useState({ val: [] });
  const [playingSongQueues, setPlayingSongQueues] = useState({ val: [] });

  const albums = [];
  for (const ar in songs) {
    for (const a in songs[ar]) {
      albums.push(songs[ar][a]);
    }
  }
  const setNowPlaying = data => {
    console.log(data);
  };

  const getSongQueues = useCallback(() => {
    let queue = localStorage.getItem(`${config.appName}_QUEUES`);
    if (queue && queue !== 'undefined') {
      queue = JSON.parse(queue);
      setSongQueues({ val: queue });
    }
  }, []);
  const getPlayingSongQueues = useCallback(() => {
    let queue = localStorage.getItem(`${config.appName}_PLAYING_QUEUES`);

    if (queue && queue !== 'undefined') {
      queue = JSON.parse(queue);
      setPlayingSongQueues({ val: queue });
    }
  }, []);
  const savePlayingSongQueues = useCallback(async queue => {
    const arr = await queue.map((q, i) => {
      delete q.cat;
      delete q.catId;
      delete q.catName;
      return { ...q, queueId: i };
    });

    localStorage.setItem(
      `${config.appName}_PLAYING_QUEUES`,
      JSON.stringify(arr)
    );

    setPlayingSongQueues({ val: arr });
  }, []);

  const saveQueue = useCallback(list => {
    if (list) {
      localStorage.setItem(`${config.appName}_QUEUES`, JSON.stringify(list));

      setSongQueues({ val: list });
      colorLog('Playlist saved', 'success');
    }
  }, []);

  const syncSavedQueue = useCallback(async () => {
    try {
      let queueId = localStorage.getItem(`${config.appName}_QUEUEID`);
      let queue = localStorage.getItem(`${config.appName}_QUEUES`);

      if (
        queueId &&
        queueId !== 'undefined' &&
        queue &&
        queue !== 'undefined'
      ) {
        queueId = JSON.parse(queueId);
        queue = JSON.parse(queue);

        const data = await request('put', `api/queue/${queueId}`, {
          songs: queue
        });

        saveQueue(data.data.data.songs);
      } else {
        queue = JSON.parse(queue);
        colorLog('Creating new queue', 'info');
        const data = await request('post', `api/queue/`, {
          songs: queue
        });
        localStorage.setItem(
          `${config.appName}_QUEUEID`,
          JSON.stringify(data.data.data._id)
        );
        saveQueue(data.data.data.songs);
      }
    } catch (err) {
      console.log(err);
    }
  }, [saveQueue]);

  const handleSetSongQueues = (type, data) => {
    const addSong = aData => {
      const arr = songQueues.val;
      arr.push({
        ...aData,
        queueId: songQueues.val.length
      });
      saveQueue(arr);
      syncSavedQueue();
    };

    if (type === 'add') {
      addSong(data);
      enqueueSnackbar(`Song added to queue`);
    } else if (type === 'play') {
      addSong(data);
    } else if (type === 'remove') {
      const filterSong = s => {
        if (s.queueId === data) {
          //Do nothing it the match is exact
        } else {
          return s;
        }
      };
      const arr = songQueues.val.filter(filterSong);
      const arr2 = arr.map((s, i) => ({ ...s, queueId: i }));

      saveQueue(arr2);
      syncSavedQueue();
      enqueueSnackbar(`Song removed from queue`);
    }
  };

  const deleteQueue = useCallback(() => {
    localStorage.setItem(`${config.appName}_QUEUES`, JSON.stringify([]));
    setSongQueues({ val: [] });
    syncSavedQueue();
  }, [syncSavedQueue]);

  const getHistory = useCallback(() => {
    const togglePlayer = () => {
      if (playerCompRef.current) {
        const path = location.pathname;
        if (path.includes('/play') && !path.includes('/playlist')) {
          playerCompRef.current.classList.remove('hide');
        } else {
          playerCompRef.current.classList.add('hide');
        }
      }
    };
    togglePlayer();
    history.listen(location => {
      togglePlayer();
    });
  }, [history, location.pathname]);

  const setPlayingData = useCallback((playing, path) => {
    if (playing) {
      setPlaying({ val: playing });
      localStorage.setItem(
        `${config.appName}_PLAYING`,
        JSON.stringify(playing)
      );
    }
    if (path) {
      setPlayPath({ val: path });
      localStorage.setItem(`${config.appName}_PLAYPATH`, JSON.stringify(path));
    }
  }, []);

  const getPlayingData = useCallback(data => {
    let playng = localStorage.getItem(`${config.appName}_PLAYING`);
    let pPath = localStorage.getItem(`${config.appName}_PLAYPATH`);

    if (playng && playng !== 'undefined') {
      playng = JSON.parse(playng);
      setPlaying({ val: playng });
    }
    if (pPath && pPath !== 'undefined') {
      pPath = JSON.parse(pPath);
      setPlayPath({ val: pPath });
    }
  }, []);

  const getPlayList = useCallback(async () => {
    let pList = localStorage.getItem(`${config.appName}_PLAYLIST`);

    if (pList && pList !== 'undefined') {
      pList = JSON.parse(pList);
      setPlayList({ val: pList });
    }
  }, []);

  const syncSavedPlayList = useCallback(async () => {
    try {
      let pList = localStorage.getItem(`${config.appName}_PLAYLIST`);

      const toLocal = async () => {
        try {
          const data = await request('get', 'api/playlist');
          localStorage.setItem(
            `${config.appName}_PLAYLIST`,
            JSON.stringify(data.data.data)
          );
          getPlayList();
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
  }, [getPlayList]);

  const createPlayList = useCallback(
    async name => {
      createPlayListRef.current.classList.remove('hide');
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

          let plList = localStorage.getItem(`${config.appName}_PLAYLIST`);

          if (plList && plList !== 'undefined') {
            plList = JSON.parse(plList);
            plList.push(newPl);
            localStorage.setItem(
              `${config.appName}_PLAYLIST`,
              JSON.stringify(plList)
            );
          } else {
            localStorage.setItem(
              `${config.appName}_PLAYLIST`,
              JSON.stringify([newPl])
            );
          }
          getPlayList();
          enqueueSnackbar('Playlist created');
          createPlayListRef.current.classList.add('hide');
          syncSavedPlayList();
        } catch (err) {
          console.log(err);
          enqueueSnackbar("Couldn't create playlist");
          createPlayListRef.current.classList.add('hide');
        }
      }
    },
    [enqueueSnackbar, getPlayList, syncSavedPlayList]
  );

  const saveToPlayList = useCallback(
    (list, i, update) => {
      list.splice(i, 1, update);
      localStorage.setItem(`${config.appName}_PLAYLIST`, JSON.stringify(list));
      getPlayList();
      syncSavedPlayList();
    },
    [getPlayList, syncSavedPlayList]
  );

  const renamePlayList = useCallback(
    name => {
      renamePlayListRef.current.classList.remove('hide');
      if (name) {
        let pList = localStorage.getItem(`${config.appName}_PLAYLIST`);
        if (pList && pList !== 'undefined') {
          pList = JSON.parse(pList);
          for (const p in pList) {
            if (pList[p]._id === temPlayListId.val) {
              pList[p].name = name;
              saveToPlayList(pList, p, pList[p]);
              enqueueSnackbar('Name updated');
              history.push(`/view/playlist/${name}/${temPlayListId.val}`);
            }
          }
        }
        renamePlayListRef.current.classList.add('hide');
      }
    },
    [enqueueSnackbar, history, saveToPlayList, temPlayListId.val]
  );

  const syncDeletedPlayList = useCallback(async () => {
    try {
      let dList = localStorage.getItem(`${config.appName}_PLAYLIST_DELETE`);

      if (dList && dList !== 'undefined') {
        dList = JSON.parse(dList);
        for (const d in dList) {
          await request('delete', `api/playlist/${dList[d]}`);
        }
        localStorage.removeItem(`${config.appName}_PLAYLIST_DELETE`);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const deletePlayList = useCallback(
    id => {
      if (id) {
        let pList = localStorage.getItem(`${config.appName}_PLAYLIST`);
        if (pList && pList !== 'undefined') {
          pList = JSON.parse(pList);
          for (const p in pList) {
            if (pList[p]._id === id) {
              pList.splice(p, 1);

              localStorage.setItem(
                `${config.appName}_PLAYLIST`,
                JSON.stringify(pList)
              );

              let dList = localStorage.getItem(
                `${config.appName}_PLAYLIST_DELETE`
              );

              if (dList && dList !== 'undefined') {
                dList = JSON.parse(dList);
                dList.push(id);
                localStorage.setItem(
                  `${config.appName}_PLAYLIST_DELETE`,
                  JSON.stringify(dList)
                );
              } else {
                localStorage.setItem(
                  `${config.appName}_PLAYLIST_DELETE`,
                  JSON.stringify([id])
                );
              }

              getPlayList();
              history.push('/playlists');
              enqueueSnackbar('Playlist deleted');
              syncDeletedPlayList();
            }
          }
        }
      }
    },
    [enqueueSnackbar, getPlayList, history, syncDeletedPlayList]
  );

  const addToPlayList = useCallback(
    (id, song, stgSong, type) => {
      addToPlayListRef.current.classList.remove('hide');

      if (stgSong) {
        setStagedSong({ val: stgSong });
      }
      if (type) {
        setAddTPLType({ val: type });
      }
      if (id && song && type) {
        addToPlayListRef.current.classList.add('hide');
        let pList = localStorage.getItem(`${config.appName}_PLAYLIST`);
        if (pList && pList !== 'undefined') {
          pList = JSON.parse(pList);
          if (type === 'single') {
            let isSongInList = false;
            for (const p in pList) {
              if (pList[p]._id === id) {
                for (const s in pList[p].songs) {
                  if (
                    song.name === pList[p].songs[s].name &&
                    song.album === pList[p].songs[s].album &&
                    song.artist === pList[p].songs[s].artist
                  ) {
                    isSongInList = true;
                    enqueueSnackbar(`Song is already in '${pList[p].name}'`);
                  }
                }
                if (!isSongInList) {
                  delete song.queueId;
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
                    delete song.queueId;
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

  const handleGroupContextMenueEvents = useCallback(
    (action, data) => {
      if (action === 'play') {
        const arr = [];
        for (const s in data) {
          delete data[s].cat;
          delete data[s].catId;
          delete data[s].catName;
          data[s].queueId = s;
          arr.push(data[s]);
        }
        setSongQueues({ val: arr });
        localStorage.setItem(`${config.appName}_QUEUES`, JSON.stringify(arr));
      } else if (action === 'queue') {
        const arr = songQueues.val;
        const l = arr.length;
        for (const s in data) {
          delete data[s].cat;
          delete data[s].catId;
          delete data[s].catName;
          data[s].queueId = l + Number(s);
          arr.push(data[s]);
        }
        setSongQueues({ val: arr });
        localStorage.setItem(`${config.appName}_QUEUES`, JSON.stringify(arr));
      } else if (action === 'rename') {
        setTempPlayListId({ val: data.id });
        renamePlayList();
      } else if (action === 'delete') {
        deletePlayList(data.id);
      }
    },
    [deletePlayList, renamePlayList, songQueues.val]
  );

  const removeFromPlayList = useCallback(
    (id, song) => {
      if (id && song) {
        let pList = localStorage.getItem(`${config.appName}_PLAYLIST`);
        if (pList && pList !== 'undefined') {
          pList = JSON.parse(pList);

          for (const p in pList) {
            if (pList[p]._id === id) {
              // listName = pList[p].name;
              for (const s in pList[p].songs) {
                if (
                  song.name === pList[p].songs[s].name &&
                  song.album === pList[p].songs[s].album &&
                  song.artist === pList[p].songs[s].artist
                ) {
                  pList[p].songs.splice(s, 1);
                }
              }

              saveToPlayList(pList, p, pList[p]);
              enqueueSnackbar('Song removed');
            }
          }
        }
      }
    },
    [enqueueSnackbar, saveToPlayList]
  );

  const syncLikes = useCallback(async () => {
    try {
      let id = localStorage.getItem(`${config.appName}_LIKESID`);
      let likes = localStorage.getItem(`${config.appName}_LIKES`);
      if (likes && likes !== 'undefined') {
        likes = JSON.parse(likes);
        if (id && id !== 'undefined') {
          id = JSON.parse(id);
          const data = await request('put', `api/like/${id}`, {
            songs: likes
          });

          localStorage.setItem(
            `${config.appName}_LIKES`,
            JSON.stringify(data.data.data.songs)
          );
        } else {
          const data = await request('post', 'api/like', {
            songs: likes
          });
          localStorage.setItem(
            `${config.appName}_LIKESID`,
            JSON.stringify(data.data.data._id)
          );
          localStorage.setItem(
            `${config.appName}_LIKES`,
            JSON.stringify(data.data.data.songs)
          );
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const [songModalData, setSongModalData] = useState({ val: {} });
  const songModalRef = useRef(null);
  const showSongModal = useCallback(data => {
    songModalRef.current.classList.remove('hide');
    setSongModalData({ val: data });
  }, []);

  const songInfoModalRef = useRef(null);
  const [songInfoModalData, setSongInfoModalData] = useState({ val: {} });
  const showSongInfoModal = useCallback(data => {
    songInfoModalRef.current.classList.remove('hide');
    setSongInfoModalData({ val: data });
  });

  /*
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   * */

  const sortWorker = new srtWorker();
  const searchWorker = new schWorker();

  const [fLCalledFrom, setFLCalledFrom] = useState({ val: '' });
  const [queueDisplay, setQueueDisplay] = useState({ val: [] });
  const [albumsDisplay, setAlbumsDisplay] = useState({ val: albums });
  const [listLandingDisplay, setListLandingDisplay] = useState({ val: [] });
  const [songMatchDisplay, setSongMatchDisplay] = useState({ val: [] });
  const [albumMatchDisplay, setAlbumMatchDisplay] = useState({ val: [] });
  const [artistMatchDisplay, setArtistMatchDisplay] = useState({ val: [] });

  const [viewSongsDisplay, setViewSongsDisplay] = useState({ val: [] });
  const viewSongsDisplayFixed = useRef(null);
  const [viewAlbumsDisplay, setViewAlbumsDisplay] = useState({ val: [] });

  const updateViewSongsDisplay = useCallback(newSongData => {
    setViewSongsDisplay({ val: newSongData });
  }, []);

  const setViewDisplay = useCallback(
    (cat, catName, catId) => {
      if (cat === 'album') {
        for (const a in songs) {
          for (const s in songs[a]) {
            if (songs[a][s].albumName === catName) {
              songs[a][s].albumSongs = songs[a][s].albumSongs.map(ss => ({
                url: ss.url,
                name: ss.name,
                cover: songs[a][s].albumArt,
                album: songs[a][s].albumName,
                artist: songs[a][s].albumArtist
              }));
              viewSongsDisplayFixed.current = songs[a][s].albumSongs;
              setViewSongsDisplay({
                val: songs[a][s].albumSongs
              });

              /**
               * The below block generates card from song names containing feat or ft
               */
              const arr = [
                {
                  albumArt: songs[a][s].albumArt,
                  albumName: songs[a][s].albumArtist
                }
              ];

              songs[a][s].albumSongs.forEach(ss => {
                let { name } = ss;
                const re = /[^le]fe?a?t\.?\s/g;

                if (re.test(name)) {
                  const typ = name.includes('feat') ? 'feat' : 'ft';
                  name = name.split(typ)[1];
                  const save = v => {
                    const obj = {
                      albumName: v.replace(/[^a-zA-Z0-9 \-$]/g, '').trim(),
                      albumArt: ss.cover
                    };

                    if (!_.find(arr, obj)) {
                      arr.push(obj);
                    }
                  };

                  name.split(/[&,]+/).forEach(n => {
                    save(n);
                  });
                }
              });
              setViewAlbumsDisplay({ val: arr });
              /**
               * End of card generation block
               */
            }
          }
        }
      } else if (cat === 'artist') {
        for (const ar in songs) {
          if (ar === catName) {
            setViewAlbumsDisplay({ val: songs[ar] });
            const arr = [];
            for (const a in songs[ar]) {
              songs[ar][a].albumSongs.forEach(s => {
                arr.push({
                  url: s.url,
                  name: s.name,
                  cover: songs[ar][a].albumArt,
                  album: songs[ar][a].albumName,
                  artist: songs[ar][a].albumArtist
                });
              });
            }
            viewSongsDisplayFixed.current = arr;
            setViewSongsDisplay({ val: arr });
          }
        }
      } else if (cat === 'genre') {
        const songsArr = [];
        const albumsArr = [];
        for (const ar in songs) {
          for (const a in songs[ar]) {
            if (songs[ar][a].albumGenre === catName) {
              albumsArr.push(songs[ar][a]);
              songs[ar][a].albumSongs.forEach(s => {
                songsArr.push({
                  url: s.url,
                  name: s.name,
                  cover: songs[ar][a].albumArt,
                  album: songs[ar][a].albumName,
                  artist: songs[ar][a].albumArtist
                });
              });
            }
          }
        }
        viewSongsDisplayFixed.current = songsArr;
        setViewAlbumsDisplay({ val: albumsArr });
        setViewSongsDisplay({ val: songsArr });
      } else if (cat === 'playlist') {
        for (const p in playList.val) {
          if (playList.val[p]._id === catId) {
            const pListSongs = playList.val[p].songs;
            viewSongsDisplayFixed.current = pListSongs;
            setViewSongsDisplay({
              val: pListSongs
            });
          }
        }
      } else if (cat === 'favorites') {
        let likes = localStorage.getItem(`${config.appName}_LIKES`);
        if (likes && likes !== 'undefined') {
          likes = JSON.parse(likes);
          viewSongsDisplayFixed.current = likes;
          setViewSongsDisplay({
            val: likes
          });
        }
      } else if (cat === 'recents') {
        let recents = localStorage.getItem(`${config.appName}_PLAYING_QUEUES`);
        if (recents && recents !== 'undefined') {
          recents = JSON.parse(recents);
          viewSongsDisplayFixed.current = recents;
          setViewSongsDisplay({ val: recents });

          const result = [];
          const map = new Map();
          for (const s of recents) {
            if (!map.has(s.album)) {
              map.set(s.album, true); // set any value to Map
              result.push({ albumName: s.album.trim(), albumArt: s.cover });
            }
          }

          setViewAlbumsDisplay({ val: result });
        }
      }
    },
    [playList.val, songs]
  );

  const updateQueueDisplay = useCallback(
    newQueueData => {
      setQueueDisplay({ val: newQueueData });
      savePlayingSongQueues(newQueueData);
    },
    [savePlayingSongQueues]
  );

  const updateAlbumsDisplay = useCallback(newAlbumData => {
    setAlbumsDisplay({ val: newAlbumData });
  }, []);

  const updateListLandingDisplay = useCallback(
    displayType => {
      const arr = [];
      if (displayType === 'artist') {
        for (const artist in songs) {
          arr.push(artist);
        }
      } else if (displayType === 'genre') {
        for (const ar in songs) {
          for (const a in songs[ar]) {
            if (songs[ar][a].albumGenre) {
              arr.push(songs[ar][a].albumGenre);
            }
          }
        }
      }

      setListLandingDisplay({ val: [...new Set(arr)].sort() });
    },
    [songs]
  );

  const handleSearch = useCallback(
    (query, cat) => {
      console.log(query, cat);
      if (cat === 'albums') {
        if (query) {
          searchWorker.postMessage([query, cat]);
          searchWorker.onmessage = ({ data }) => {
            updateAlbumsDisplay(data);
          };
        } else {
          updateAlbumsDisplay(albums);
        }
      } else if (cat === 'artist' || cat === 'genre') {
        searchWorker.postMessage([query, cat]);
        searchWorker.onmessage = ({ data }) => {
          setListLandingDisplay({ val: data });
        };
      } else if (cat === 'search') {
        searchWorker.postMessage([query, cat]);
        searchWorker.onmessage = ({ data }) => {
          setSongMatchDisplay({ val: data[0] });
          setAlbumMatchDisplay({ val: data[1] });
          setArtistMatchDisplay({ val: data[2] });
        };
      }
    },
    [albums, searchWorker, updateAlbumsDisplay]
  );

  const filterList = useCallback(
    (calledFrom, type) => {
      filterModalRef.current.classList.remove('hide');
      setFLCalledFrom({ val: calledFrom });
      if (type && fLCalledFrom.val) {
        console.log(fLCalledFrom.val, type);
        filterModalRef.current.classList.add('hide');

        if (fLCalledFrom.val === 'queue') {
          sortWorker.postMessage([queueDisplay.val, type, 'songs']);
          sortWorker.onmessage = ({ data }) => {
            updateQueueDisplay(data);
          };
        } else if (fLCalledFrom.val === 'albums') {
          sortWorker.postMessage([albumsDisplay.val, type, 'albums']);
          sortWorker.onmessage = ({ data }) => {
            updateAlbumsDisplay(data);
          };
        } else if (
          fLCalledFrom.val === 'artist' ||
          fLCalledFrom.val === 'genre'
        ) {
          sortWorker.postMessage([listLandingDisplay.val, type, 'artist']);
          sortWorker.onmessage = ({ data }) => {
            setListLandingDisplay({ val: data });
          };
        } else if (fLCalledFrom.val === 'search songs') {
          sortWorker.postMessage([songMatchDisplay.val, type, 'songs']);
          sortWorker.onmessage = ({ data }) => {
            setSongMatchDisplay({ val: data });
          };
        } else if (fLCalledFrom.val === 'search albums') {
          sortWorker.postMessage([albumMatchDisplay.val, type, 'artist']);
          sortWorker.onmessage = ({ data }) => {
            setAlbumMatchDisplay({ val: data });
          };
        } else if (fLCalledFrom.val === 'search artists') {
          sortWorker.postMessage([artistMatchDisplay.val, type, 'artist']);
          sortWorker.onmessage = ({ data }) => {
            setArtistMatchDisplay({ val: data });
          };
        } else if (fLCalledFrom.val === 'view') {
          sortWorker.postMessage([viewSongsDisplay.val, type, 'songs']);
          sortWorker.onmessage = ({ data }) => {
            updateViewSongsDisplay(data);
          };
        }
      }
    },
    [
      albumMatchDisplay.val,
      albumsDisplay.val,
      artistMatchDisplay.val,
      fLCalledFrom.val,
      listLandingDisplay.val,
      queueDisplay.val,
      songMatchDisplay.val,
      sortWorker,
      updateAlbumsDisplay,
      updateQueueDisplay,
      updateViewSongsDisplay,
      viewSongsDisplay.val
    ]
  );

  useEffect(() => {
    getHistory();
    getPlayList();
    getPlayingData();
    getSongQueues();
    getPlayingSongQueues();
    if (location.pathname.includes('/play/')) {
      setPlayPath({ val: location.search });
    }
  }, [
    getHistory,
    getPlayList,
    getPlayingData,
    getPlayingSongQueues,
    getSongQueues,
    location.pathname,
    location.search
  ]);

  return (
    <Router>
      <div className='App App__main'>
        <Nav playPath={playPath.val} />
        <SongInfoModal ref={songInfoModalRef} data={songInfoModalData.val} />
        <CreatePlayList
          ref={createPlayListRef}
          createPlayList={createPlayList}
        />
        <RenamePlayList
          ref={renamePlayListRef}
          renamePlayList={renamePlayList}
        />
        <FilterModal ref={filterModalRef} filterList={filterList} />
        <AddToPlayList
          ref={addToPlayListRef}
          playList={playList.val}
          addTPLType={addTPLType.val}
          stagedSong={stagedSong.val}
          addToPlayList={addToPlayList}
          createPlayList={createPlayList}
        />
        <SongModal
          ref={songModalRef}
          syncLikes={syncLikes}
          showSongInfoModal={showSongInfoModal}
          removeFromPlayList={removeFromPlayList}
          addToPlayList={addToPlayList}
          data={songModalData.val}
          handleSetSongQueues={handleSetSongQueues}
        />
        <NowPlaying
          songs={songs}
          ref={{
            playerRef,
            playerCompRef
          }}
          syncLikes={syncLikes}
          data={playing.val}
          playPath={playPath.val}
          showSongModal={showSongModal}
          setPlayingData={setPlayingData}
          queuePlayBtnRef={queuePlayBtnRef}
          showSongInfoModal={showSongInfoModal}
          playingSongQueues={playingSongQueues.val}
        />
        <Switch>
          <Route exact path='/' render={props => <Root />} />
          <Route exact path='/signin' render={props => <Signin />} />
          <Route
            path='/play/:playId'
            render={props => (
              <Play
                {...props}
                songs={songs}
                setNowPlaying={setNowPlaying}
                setPlayingData={setPlayingData}
              />
            )}
          />
          <Route
            exact
            path='/queues'
            render={props => (
              <Queues
                {...props}
                ref={{
                  queuePlayBtnRef
                }}
                playerRef={playerRef}
                playing={playing.val}
                playList={playList.val}
                filterList={filterList}
                deleteQueue={deleteQueue}
                songQueues={songQueues.val}
                showSongModal={showSongModal}
                addToPlayList={addToPlayList}
                queueDisplay={queueDisplay.val}
                updateQueueDisplay={updateQueueDisplay}
                handleSetSongQueues={handleSetSongQueues}
              />
            )}
          />
          <Route
            exact
            path='/albums'
            render={props => (
              <Albums
                {...props}
                filterList={filterList}
                handleSearch={handleSearch}
                albumsDisplay={albumsDisplay.val}
                updateAlbumsDisplay={updateAlbumsDisplay}
              />
            )}
          />
          <Route
            exact
            path='/artist'
            render={props => (
              <Artist
                {...props}
                filterList={filterList}
                handleSearch={handleSearch}
                listLandingDisplay={listLandingDisplay.val}
                updateListLandingDisplay={updateListLandingDisplay}
              />
            )}
          />
          <Route
            exact
            path='/playlists'
            render={props => (
              <PlayLists
                {...props}
                playList={playList.val}
                getPlayList={getPlayList}
                createPlayList={createPlayList}
              />
            )}
          />
          <Route
            exact
            path='/genre'
            render={props => (
              <Genre
                {...props}
                filterList={filterList}
                handleSearch={handleSearch}
                listLandingDisplay={listLandingDisplay.val}
                updateListLandingDisplay={updateListLandingDisplay}
              />
            )}
          />{' '}
          <Route
            exact
            path='/search'
            render={props => (
              <Search
                {...props}
                filterList={filterList}
                handleSearch={handleSearch}
                showSongModal={showSongModal}
                songMatchDisplay={songMatchDisplay.val}
                albumMatchDisplay={albumMatchDisplay.val}
                handleSetSongQueues={handleSetSongQueues}
                artistMatchDisplay={artistMatchDisplay.val}
              />
            )}
          />{' '}
          <Route
            exact
            path='/settings'
            render={props => <Settings {...props} />}
          />
          <Route
            exact
            path='/view/:cat/:catName/:catId'
            render={props => (
              <View
                {...props}
                viewSongsDisplay={viewSongsDisplay.val}
                ref={{
                  viewSongsDisplayFixed
                }}
                setViewDisplay={setViewDisplay}
                filterList={filterList}
                viewAlbumsDisplay={viewAlbumsDisplay.val}
                updateViewSongsDisplay={updateViewSongsDisplay}
                addToPlayList={addToPlayList}
                showSongModal={showSongModal}
                handleSetSongQueues={handleSetSongQueues}
                handleGroupContextMenueEvents={handleGroupContextMenueEvents}
              />
            )}
          />
        </Switch>
      </div>
    </Router>
  );
});

export default Home;
// export default withRouter(App);

{
  /* <SongModal
catId={catId}
cat={cat}
syncLikes={syncLikes}
ref={songModalRef}
addToPlayList={addToPlayList}
removeFromPlayList={removeFromPlayList}
songModalData={songModalData.val}
handleSetSongQueues={handleSetSongQueues}
/> */
}
