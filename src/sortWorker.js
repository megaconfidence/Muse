const shuffle = array => {
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

const orderSongs = array => {
  return array.sort((a, b) =>
    a.name > b.name
      ? 1
      : a.name === b.name
      ? a.artist > b.artist
        ? 1
        : -1
      : -1
  );
};

const orderAlbums = array => {
  return array.sort((a, b) =>
    a.albumName > b.albumName
      ? 1
      : a.albumName === b.albumName
      ? a.albumArtist > b.albumArtist
        ? 1
        : -1
      : -1
  );
};

onmessage = function({ data }) {
  if (data[1] === 'randomize') {
    postMessage(shuffle(data[0]));
  } else if (data[1] === 'reverse') {
    postMessage(data[0].reverse());
  } else if (data[1] === 'ascending') {
    if (data[2] === 'songs') {
      postMessage(orderSongs(data[0]));
    } else if (data[2] === 'albums') {
      postMessage(orderAlbums(data[0]));
    } else if (data[2] === 'artist' || data[2] === 'genre') {
      postMessage(data[0].sort());
    }
  } else if (data[1] === 'desending') {
    if (data[2] === 'songs') {
      postMessage(orderSongs(data[0]).reverse());
    } else if (data[2] === 'albums') {
      postMessage(orderAlbums(data[0]).reverse());
    } else if (data[2] === 'artist' || data[2] === 'genre') {
      postMessage(data[0].sort().reverse());
    }
  }
};
