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
  return await axios
    .post(`${url}/scrobbles`, { track, userID: userID })
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

