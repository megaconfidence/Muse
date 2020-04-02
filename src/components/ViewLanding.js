import React, {
  forwardRef,
  useState,
  useEffect,
  useCallback,
  useRef
} from 'react';
import './ViewLanding.css';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';

const withRouterAndRef = Wrapped => {
  const WithRouter = withRouter(({ forwardRef, ...otherProps }) => (
    <Wrapped ref={forwardRef} {...otherProps} />
  ));
  const WithRouterAndRef = forwardRef((props, ref) => (
    <WithRouter {...props} forwardRef={ref} />
  ));
  const name = Wrapped.displayName || Wrapped.name;
  WithRouterAndRef.displayName = `withRouterAndRef(${name})`;
  return WithRouterAndRef;
};

function ViewLanding({ path, songs, history }) {
  path = path.split('/');
  const cat = path[0];
  const id = path[1];
  const allSongsFixed = useRef(null);
  const [allSongs, setAllSongs] = useState({ val: [] });
  const [allAlbums, setAllAlbums] = useState({ val: [] });

  const handleListCardClick = i => {
    if (cat === 'album') {
      document
        .querySelectorAll('.vLanding__info__list__card')
        .forEach((e, k) => {
          if (k === i) {
            e.classList.add('vLanding__info__list__card--select');
            if (i === 0 || i === 1) {
              /**
               * Do nothing if first or second card is clicked
               */
              setAllSongs({ val: allSongsFixed.current });
            } else {
              /**
               * Show songs containing card name
               */
              const arr = [];
              allSongs.val = allSongsFixed.current;
              const cardName = e.textContent.toLowerCase();

              allSongs.val.forEach(s => {
                const re = /fe?a?t\.?\s/g;
                s.name = s.name.replace(/[^a-zA-Z0-9 \-$]/g, '');
                if (
                  re.test(s.name) &&
                  s.name.search(re) < s.name.lastIndexOf(cardName)
                ) {
                  arr.push(s);
                }
              });
              setAllSongs({ val: arr || allSongs.val });
            }
          } else {
            e.classList.remove('vLanding__info__list__card--select');
          }
        });
    } else if (cat === 'artist') {
      document
        .querySelectorAll('.vLanding__info__list__card')
        .forEach((e, k) => {
          if (k === i) {
            e.classList.add('vLanding__info__list__card--select');
            if (i === 0) {
              /**
               * Do nothing if first card is clicked
               */
              setAllSongs({ val: allSongsFixed.current });
            } else {
              /**
               * Show songs containing card name
               */
              const arr = [];
              allSongs.val = allSongsFixed.current;
              const cardName = e.textContent.toLowerCase();

              allSongs.val.forEach(s => {
                // console.log(s)
                if (s.txt.includes(cardName)) {
                  arr.push(s);
                }
              });
              setAllSongs({ val: arr || allSongs.val });
            }
          } else {
            e.classList.remove('vLanding__info__list__card--select');
          }
        });
    }
  };
  const getSongs = useCallback(() => {
    if (cat === 'album') {
      for (const a in songs) {
        for (const s in songs[a]) {
          if (songs[a][s].albumName === id) {
            songs[a][s].albumSongs = songs[a][s].albumSongs.map(ss => ({
              url: ss.url,
              name: ss.name,
              art: songs[a][s].albumArt,
              txt: songs[a][s].albumArtist
            }));
            allSongsFixed.current = songs[a][s].albumSongs;
            setAllSongs({
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
              // name.includes('feat.') ||
              // name.includes('ft.') ||
              // name.includes(' feat ') ||
              // name.includes(' ft ') ||
              // name.includes('(feat ') ||
              // name.includes('(ft ')
              if (re.test(name)) {
                const typ = name.includes('feat') ? 'feat' : 'ft';
                name = name.split(typ)[1];
                const save = v => {
                  const obj = {
                    albumName: v.replace(/[^a-zA-Z0-9 \-$]/g, '').trim(),
                    albumArt: ss.art
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
            setAllAlbums({ val: arr });
            /**
             * End of card generation block
             */
          }
        }
      }
    } else if (cat === 'artist') {
      for (const ar in songs) {
        if (ar === id) {
          setAllAlbums({ val: songs[ar] });
          const arr = [];
          for (const a in songs[ar]) {
            songs[ar][a].albumSongs.forEach(s => {
              arr.push({
                url: s.url,
                name: s.name,
                art: songs[ar][a].albumArt,
                txt: songs[ar][a].albumName
              });
            });
          }
          allSongsFixed.current = arr;
          setAllSongs({ val: arr });
        }
      }
    }
  }, [cat, id, songs]);

  useEffect(() => {
    getSongs();
  }, [getSongs]);

  return (
    <div className='vLanding'>
      <div className='vLanding__nav'>
        <div
          data-img
          data-imgname='arrow_left'
          className='vLanding__nav__icon'
          onClick={history.goBack}
        />
        <div className='vLanding__nav__text truncate'>{id}</div>
        <div data-img data-imgname='settings' className='vLanding__nav__icon' />
      </div>
      <div className='vLanding__info'>
        <div className='vLanding__info__type'>
          <div className='vLanding__info__type__text'>
            {cat === 'artist' ? 'Albums' : 'Artists'}
          </div>
          <div
            data-img
            data-imgname='caret_down'
            className='vLanding__info__type__icon'
          />
        </div>
        <div className='vLanding__info__list'>
          <div
            className='vLanding__info__list__card vLanding__info__list__card--select'
            onClick={() => {
              handleListCardClick(0);
            }}
          >
            <div className='vLanding__info__list__card__wrapper'>
              <div className='vLanding__info__list__card__name'>
                All {cat === 'artist' ? 'albums' : 'artists'}
              </div>
              <div className='vLanding__info__list__card__highlight'></div>
            </div>
          </div>
          {allAlbums.val.map((a, k) => (
            <div
              key={k}
              className='vLanding__info__list__card'
              style={{ backgroundImage: `url(${a.albumArt})` }}
              onClick={() => {
                handleListCardClick(k + 1);
              }}
            >
              <div className='vLanding__info__list__card__wrapper'>
                <div className='vLanding__info__list__card__name'>
                  <span>{a.albumName}</span>
                </div>
                <div className='vLanding__info__list__card__highlight'></div>
              </div>
            </div>
          ))}
          <div className='vLanding__info__list__clearFix'>.</div>
        </div>
        <div className='vLanding__info__msc'>
          <div className='vLanding__info__msc__numArtist'>
            {allAlbums.val.length}{' '}
            {cat === 'artist' ? 'albums' : 'album artists'}
          </div>
          <div className='vLanding__info__msc__numSongs'>
            {allSongs.val.length} songs
          </div>
        </div>
      </div>
      <div className='vLanding__songs'>
        <div className='vLanding__songs__control'>
          <div data-img data-imgname='repeat' />
          <div data-img data-imgname='sort' />
          <div data-img data-imgname='menu_horizontal' />
        </div>
        <div className='vLanding__songs__list'>
          {allSongs.val.map((s, k) => (
            <div key={k} className='vLanding__songs__list__item'>
              <div
                className='vLanding__songs__list__item__img'
                style={{ backgroundImage: `url(${s.art})` }}
              />
              <div className='vLanding__songs__list__item__text'>
                <div className='vLanding__songs__list__item__text__song '>
                  {s.name}
                </div>
                <div className='vLanding__songs__list__item__text__artist truncate'>
                  {s.txt}
                </div>
              </div>
              <div
                data-img
                data-imgname='menu_horizontal'
                className='vLanding__songs__list__item__option'
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default withRouterAndRef(ViewLanding);
