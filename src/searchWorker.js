import { data as appData } from './data.json';
onmessage = function({ data }) {
  const arr = [];
  if (data[1] === 'albums') {
    for (const ar in appData) {
      for (const a in appData[ar]) {
        if (appData[ar][a].albumName.includes(data[0])) {
          arr.push(appData[ar][a]);
        }
      }
    }

    postMessage(arr);
  } else if (data[1] === 'artist') {
    for (const ar in appData) {
      if (ar.includes(data[0])) {
        arr.push(ar);
      }
    }
    postMessage(arr);
  } else if (data[1] === 'genre') {
    for (const ar in appData) {
      for (const a in appData[ar]) {
        if (appData[ar][a].albumGenre) {
          if (appData[ar][a].albumGenre.includes(data[0])) {
            arr.push(appData[ar][a].albumGenre);
          }
        }
      }
    }
    postMessage(arr);
  } else if (data[1] === 'search') {
    const songMatchArr = [];
    const albumMatchArr = [];
    const artistMatchArr = [];

    if (data[0]) {
      for (const ar in appData) {
        if (ar.includes(data[0])) {
          artistMatchArr.push(ar);
        }

        for (const a in appData[ar]) {
          if (appData[ar][a].albumName.includes(data[0])) {
            albumMatchArr.push(appData[ar][a].albumName);
          }
          for (const s in appData[ar][a].albumSongs) {
            if (appData[ar][a].albumSongs[s].name.includes(data[0])) {
              const obj = {
                cover: appData[ar][a].albumArt,
                album: appData[ar][a].albumName,
                artist: appData[ar][a].albumArtist,
                url: appData[ar][a].albumSongs[s].url,
                name: appData[ar][a].albumSongs[s].name
              };
              songMatchArr.push(obj);
            }
          }
        }
      }
    }

    postMessage([songMatchArr, albumMatchArr, artistMatchArr]);
  }
};

//  const getSearchVal = val => {
//     const songMatchArr = [];
//     const albumMatchArr = [];
//     const artistMatchArr = [];

//     setSearchVal({ val });

//     if (val) {
//       for (const ar in songs) {
//         if (ar.includes(val)) {
//           artistMatchArr.push(ar);
//         }

//         for (const a in songs[ar]) {
//           if (songs[ar][a].albumName.includes(val)) {
//             albumMatchArr.push(songs[ar][a].albumName);
//           }
//           for (const s in songs[ar][a].albumSongs) {
//             if (songs[ar][a].albumSongs[s].name.includes(val)) {
//               const obj = {
//                 cover: songs[ar][a].albumArt,
//                 album: songs[ar][a].albumName,
//                 artist: songs[ar][a].albumArtist,
//                 url: songs[ar][a].albumSongs[s].url,
//                 name: songs[ar][a].albumSongs[s].name
//               };
//               songMatchArr.push(obj);
//             }
//           }
//         }
//       }
//     }
//     setSongMatch({ val: songMatchArr });
//     setAlbumMatch({ val: albumMatchArr });
//     setArtistMatch({ val: artistMatchArr });
//   };
