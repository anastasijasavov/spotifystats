import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Login";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Stats } from "./components/stats/Stats";
import Main from "./components/main/Main";
import Header from "./components/header/Header";
// import Tab from '@mui/material/Tab';
import { useState, useMemo, useEffect, useRef } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import useAuth from "./useAuth";
import { Track } from "./models/Track"
import { saveUser } from "./utils/http-requests";
import { saveScrobble } from "./utils/http-requests";

// function LinkTab(props) {
//   return (
//     <Tab
//       component="a"
//       onClick={(event) => {
//         event.preventDefault();
//       }}
//       {...props}
//     />
//   );
// }

let code = new URLSearchParams(window.location.search).get("code");

function App() {
  const spotifyApi = useMemo(() => new SpotifyWebApi({ clientId: "0cc65edbfc7649b087b605c605e9aade" }), []);
  const [isSaved, setIsSaved] = useState(false);
  const [data, setData] = useState({})
  const [track, setTrack] = useState(new Track());
  const [songPlayedAt, setSongPlayedAt] = useState(0);

  function SetToken(code) {
    const accessToken = useAuth(code);
    spotifyApi.setAccessToken(accessToken);
    console.log("trying to authenticate user");
    window.localStorage.setItem("accessToken", accessToken);
    return <></>;
  }
  // const [value, setValue] = useState(0);
  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };
  function sendData() {
    setData({
      isSaved: isSaved,
      track: track,
    });
  }
  useEffect(() => {
    const accessToken = window.localStorage.getItem("accessToken");
    if (accessToken) {
      console.log("spotify api from main.js ", spotifyApi);
      spotifyApi.setAccessToken(accessToken);
      spotifyApi.getMe().then(
        function (data) {
          saveUser(data.body.id, data.body.display_name);
          window.localStorage.setItem("userID", data.body.id);
        },
        function (err) {
          console.log("Something went wrong with saving the user!", err);
        }
      );
    }
  }, [spotifyApi]);

  useEffect(() => {
    const accessToken = window.localStorage.getItem("accessToken");

    if (!accessToken) return;

    const interval = setInterval(() => {

      spotifyApi.getMyCurrentPlayingTrack().then(
        function (data) {
          if (data.body == null || !data.body.is_playing || data.body.item.duration_ms == null) { return; }

          if (data.body.progress_ms / data.body.item.duration_ms < 0.3) {
            console.log("namestanje pocetka pesme");
            setSongPlayedAt(data.body.timestamp);
          }

          const scrobble = new Track(
            data.body.item.id,
            data.body.item.name,
            data.body.item.artists[0].name,
            data.body.item.duration_ms,
            data.body.timestamp,
            data.body.item.album.images[1].url
          );
          if (!isSaved)
            spotifyApi.containsMySavedTracks([data.body.item.id]).then(
              function (data) {
                if (data.body == null) setIsSaved(false);
                // An array is returned, where the first element corresponds to the first track ID in the query
                var trackIsInYourMusic = data.body[0];

                if (trackIsInYourMusic) {
                  setIsSaved(true);
                } else {
                  setIsSaved(false);
                }
              },
              function (err) {
                console.log(
                  "Something went wrong with checking whether the current song is saved!",
                  err
                );
                setIsSaved(false);
              }
            );

          setTrack(scrobble);
          sendData();
          if (
            (data.body.item.id !== track.id &&
              data.body.progress_ms / data.body.item.duration_ms > 0.5) ||
            (track.id === "undefined")
          ) {
            var today = new Date();
            var today_ms = today.getTime();


            console.log("the song has changed");

            console.log("prev track timestamp:", track.timestamp);
            console.log("api timestamp: ", data.body.timestamp);
            console.log(" track progress:", data.body.progress_ms);
            console.log("api track duration:", data.body.item.duration_ms);

            let progressRatio = (today_ms - songPlayedAt) / data.body.progress_ms;
            console.log("ratio:", progressRatio);

            if (progressRatio > 0.6) {
              console.log("song is being saved");
              saveScrobble(scrobble, window.localStorage.getItem("userID"));

            }


          }

        },
        function (err) {

          console.log("error 401");
          window.localStorage.removeItem("refreshToken");
          window.localStorage.removeItem("accessToken");
          window.location = "/";

          //set refresh token
          console.log("Refreshing the token...", err);
        }
      );

    }, [5000]);

    return () => {
      clearInterval(interval);
    }

  });

  if (code == null)
    return <Login />;

  const token = window.localStorage.getItem("accessToken")
  //console.log("local storage is null but code is not");
  //window.localStorage.setItem("accessToken", accessToken);
  if (token == null || token === "undefined") {
    SetToken(code);
  }

  if (token != null && token !== "undefined") {


    return (
      <Router>
        <div style={{ /*backgroundColor: "#121212" */ }}>
          <Header spotifyApi={spotifyApi} />
          <Routes>
            <Route path="/" element={<Main spotifyApi={spotifyApi} trackData={data} />}></Route>
            <Route path="/stats" element={<Stats spotifyApi={spotifyApi} />}></Route>
            <Route path="/me" element={<h2>Me</h2>}></Route>
          </Routes>
        </div>
      </Router>
    );
  }



}

export default App;
