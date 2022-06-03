import axios from "axios";

const url = "http://localhost:3005";

export function getAllUsers() {
  return axios.get(`${url}/users`);
}

export async function saveUser(id, name) {
  let userExists = true;
  await axios
    .get(`${url}/users/${id}`)
    .then(() => {
      console.log("user exists");
      userExists = true;
    })
    .catch((err) => {
      if (err.response) {
        userExists = false;
      }
    });

  if (!userExists) {
    return await axios
      .post(`${url}/users`, {
        id,
        name,
      })
      .then(console.log(`successfully saved ${name} in the db!`))
      .catch((err) => {
        if (err.response) {
          return;
        }
      });
  }
}

export async function saveScrobble(track, userID) {
  console.log(track.name, userID);
  const scrobble = {
    id: track.id,
    name: track.name,
    artist: track.artist,
    duration: track.duration,
    album: track.album,
    scrobble_id: track.scrobble_id,
    minutes: track.minutes,
    seconds: track.seconds,
  };
  return await axios
    .post(`${url}/scrobbles`, { track: scrobble, userID: userID, album: track.album_id })
    .then(() => {
      console.log("song saved");
    })
    .catch((err) => {
      console.log("couldnt save scrobble");
    });
}

export async function getMyScrobbles(userID) {
  return await axios
    .get(`${url}/scrobbles?userID=${userID}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log("couldnt get scrobbles", err);
    });
}

export async function removeScrobble(id) {
  return await axios
    .delete(`${url}/scrobbles/${id}`)
    .then(console.log("successfully removed scrobble"))
    .catch((err) => console.log(err));
}

export async function getScrobblesForPeriod(userID, period) {

  return await axios
    .get(`${url}/scrobbles?userID=${userID}`)
    .then((res) => {
      const data = res.data;
      data.then(tracks => {
        var today = new Date().getMilliseconds();

        tracks.filter(track => track.track.scrobble_id >= today - period);
        return tracks;
      })
      console.log(`data from last period of:${period}ms: ${data}`);
    })
    .catch((err) => {
      console.log("couldnt get scrobbles", err);
    });
}

export function getMe() {
  return window.localStorage.getItem("userID");
}

export function authenticateUser() {
  return window.localStorage.getItem("accessToken") != null &&
    window.localStorage.getItem("userID") != null ?
    true : console.log("Couldn't authenticate user.");
}

export async function addAlbumInfo(spotifyApi) {

  let tracks = await axios.get(`${url}/scrobbles`);
  tracks = tracks.data.slice(10, 25);

  console.log(tracks);

  const trackIDs = tracks.map(track => track.track.id);

  const albumIDs = await spotifyApi.getTracks(trackIDs).then(res => {
    console.log(res);
    return res.body.tracks.map(track => track.album.id);
  });

  console.log(albumIDs);
  for (let i = 0; i < tracks.length; i++) {
    let track = tracks[i];
    let album = albumIDs[i];

    let updatedTrack = { ...track, album: album };
    console.log(updatedTrack);
    const response = await axios.patch(`${url}/scrobbles/${track.id}`, updatedTrack);
    console.log(response);
  }
  return true;
}

export async function getTopAlbums(spotifyApi) {
  //get albums into groups
  const userID = getMe();

  let tracks = await axios.get(`${url}/scrobbles?userID=${userID}`);
  if (tracks) {
    let albums = tracks.data.map(track => { return { id: track.album, url: track.track.album } });
    let albumGroups = [{}];

    for (let i = 0; i < albums.length; i++) {
      let element = albums[i];
      let found = albumGroups.findIndex(el => el.id === element.id);

      if (found === -1 || Object.keys(albumGroups).length === 0) {
        albumGroups.push({
          id: element.id,
          url: element.url,
          count: 1
        })
      }
      else {
        albumGroups[found].count++;
      }

    }
    albumGroups.sort((a, b) => b.count - a.count);

    albumGroups = albumGroups.slice(1, 10);

    return albumGroups;
  }

  //spotifyApi.getAlbums(albums).then(res => console.log(res));
  //find album info for top 
}