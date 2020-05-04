import config from 'environment';
import request from '../../helpers';
import AppContext from './AppContext';
import { useSnackbar } from 'notistack';
import colorLog from '../../helpers/colorLog';
import { useContext } from 'react';

const useQueue = () => {
  const { enqueueSnackbar } = useSnackbar();
  // eslint-disable-next-line no-unused-vars
  const [_, setAppData] = useContext(AppContext);
  const syncSavedQueue = async (appcontext) => {
    try {
      const queueId = JSON.parse(
        localStorage.getItem(`${config.appName}_QUEUEID`)
      );
      const queue = JSON.parse(
        localStorage.getItem(`${config.appName}_QUEUES`)
      );

      if (queueId && queue) {
        const data = await request('put', `api/queue/${queueId}`, {
          songs: queue
        });
        const nQueue = data.data.data.songs;
        localStorage.setItem(
          `${config.appName}_QUEUES`,
          JSON.stringify(nQueue)
        );
        setAppData({ ...appcontext, queue: nQueue });
      } else {
        colorLog('Creating new queue', 'info');
        const data = await request('post', `api/queue/`, {
          songs: queue
        });
        localStorage.setItem(
          `${config.appName}_QUEUEID`,
          JSON.stringify(data.data.data._id)
        );
        const nQueue = data.data.data.songs;
        localStorage.setItem(
          `${config.appName}_QUEUES`,
          JSON.stringify(nQueue)
        );
        setAppData({ ...appcontext, queue: nQueue });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const saveQueue = (item, appcontext) => {
    const queue = JSON.parse(localStorage.getItem(`${config.appName}_QUEUES`));
    if (queue) {
      queue.push(item);
      localStorage.setItem(`${config.appName}_QUEUES`, JSON.stringify(queue));
      setAppData({ ...appcontext, queue });
    } else {
      localStorage.setItem(`${config.appName}_QUEUES`, JSON.stringify(item));
      setAppData({ ...appcontext, queue: item });
    }

    colorLog('Playlist saved', 'success');
    syncSavedQueue(appcontext);
  };

  const mutateQueue = (type, data, appcontext) => {
    const addSong = (aData) => {
      saveQueue(
        {
          ...aData,
          queueId: appcontext.queue.length
        },
        appcontext
      );
    };
    if (type === 'add') {
      addSong(data);
      enqueueSnackbar(`Song added to queue`);
    } else if (type === 'play') {
      addSong(data);
    } else if (type === 'remove') {
      const filterSong = (s) => {
        if (s.queueId === data) {
          //Do nothing it the match is exact
        } else {
          return s;
        }
      };
      const arr = appcontext.queue.filter(filterSong);
      const arr2 = arr.map((s, i) => ({ ...s, queueId: i }));

      saveQueue(arr2);
      enqueueSnackbar(`Song removed from queue`);
    }
  };

  const deleteQueue = (appcontext) => {
    localStorage.setItem(`${config.appName}_QUEUES`, JSON.stringify([]));
    setAppData({ ...appcontext, queue: [] });
    syncSavedQueue(appcontext);
  };

  return {
    mutateQueue,
    deleteQueue
  };
};

export default useQueue;
