/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-loop-func */
const fs = require('fs');
const request = require('request');

const exits = (name) => fs.existsSync(name);
const getTracksJSON = (name, cb) =>
  fs.readFile(name, (err, data) => {
    cb(err, data);
  });

const getTokenSpotify = () => {
  let rejectOut;
  try {
    return new Promise((resolve, reject) => {
      rejectOut = reject;
      request.post(
        'https://accounts.spotify.com/api/token',
        {
          form: {
            grant_type: 'client_credentials',
            client_id: '9372087c65ff448fbb0c9288e550cd4d',
            client_secret: '965a5df1b77b4872951bddf3d2365165',
          },
        },
        (err, respo) => {
          process.env.API_TOKEN = respo.body;
          resolve(respo.body);
        }
      );
    });
  } catch (error) {
    rejectOut();
  }
};

const AddTodbJson = (namefile, req) => {
  let obj;
  let json;
  if (exits(namefile)) {
    getTracksJSON(namefile, (_, buffer) => {
      if (_) return { error: _ };
      obj = JSON.parse(buffer);
      obj.tracks.push(req.file);
      json = JSON.stringify(obj);
      fs.writeFile(namefile, json, 'utf8', () => {});
    });
  } else {
    const object = { tracks: [req.file] };
    fs.writeFile(namefile, JSON.stringify(object), 'utf8', () => {});
  }
};

const getTokenIMG = (name, type, token) => {
  let rejectOut;
  try {
    return new Promise((resolve, reject) => {
      rejectOut = reject;
      request.get(
        `https://api.spotify.com/v1/search?q=${name}&type=${type}`,
        { headers: { Authorization: `Bearer ${token}` } },
        (err, respo) => {
          if (err) {
            getTokenSpotify();
            resolve({ error: 500 });
          }

          resolve(respo.body);
        }
      );
    });
  } catch (error) {
    rejectOut(error);
  }
};

const SearchImage = async (req) => {
  const data = process.env.API_TOKEN || (await getTokenSpotify());
  const dataJSON = JSON.parse(data);
  const token = dataJSON.access_token;

  let dataIMG = await getTokenIMG(req.body.name, 'track', token);
  if (dataIMG.error) {
    dataIMG = await getTokenIMG(req.body.name, 'track', token);
  }

  const dataIMGJSON = JSON.parse(dataIMG);
  let imgs = null;
  let i = 0;

  while (imgs == null) {
    const img = dataIMGJSON.tracks.items[i];
    const nameApi = img.album.name.toLowerCase();
    const name = req.body.name.toLowerCase();
    const { artists } = img;
    const artist = req.body.author.toLowerCase();

    artists.map((dataArtist) => {
      const nameArtist = dataArtist.name.toLowerCase();
      if (nameArtist.includes(artist)) {
        imgs = img.album.images;
      }
    });

    if (nameApi.includes(name) && imgs == null) {
      imgs = img.album.images;
    }
    if (dataIMGJSON.tracks.items.length < i + 2) {
      imgs = [{}];
    }
    i += 1;
  }

  // eslint-disable-next-line no-unused-expressions
  imgs.length > 1 ? (req.file.img = imgs[1]) : (req.file.img = imgs[0]);
};

module.exports = {
  exits,
  getTracksJSON,
  getTokenIMG,
  SearchImage,
  AddTodbJson,
};
