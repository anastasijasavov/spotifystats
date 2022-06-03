import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Stats } from "./components/Stats/Stats";
import Main from "./components/main/Main";
import Header from "./components/header/Header";
import { SongAnalysis } from "./components/Stats/SongAnalysis/SongAnalysis";
import { useState, useMemo, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import { checkIfSaved } from "./utils/spotifyService";
import useAuth from "./useAuth";
import { Track } from "./models/Track"
import { saveUser } from "./utils/http-requests";
import { saveScrobble } from "./utils/http-requests";
import NotificationCard from "./components/NotificationCard/NotificationCard";

let code = new URLSearchParams(window.location.search).get("code");

function App() {
  const spotifyApi = useMemo(() => new SpotifyWebApi({ clientId: "0cc65edbfc7649b087b605c605e9aade" }), []);
  const [isSaved, setIsSaved] = useState(false);
  const [data, setData] = useState({});
  const [track, setTrack] = useState(new Track());
  const [prevTrack, setPrevTrack] = useState(new Track());
  const [saved, setSaved] = useState(false);

  async function checkSaved(id) {
    setIsSaved(await checkIfSaved(spotifyApi, id));
  }

  function SetToken(code) {
    const accessToken = useAuth(code);
    spotifyApi.setAccessToken(accessToken);
    console.log("trying to authenticate user");
    window.localStorage.setItem("accessToken", accessToken);
    return <></>;
  }

  function sendData() {
    setData({
      isSaved: isSaved,
      track: prevTrack,
    });
  }

  useEffect(() => {
    const accessToken = window.localStorage.getItem("accessToken");
    if (accessToken) {
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
    let scrobble;
    if (!accessToken) return;

    const interval = setInterval(() => {

      spotifyApi.getMyCurrentPlayingTrack().then(
        function (data) {
          if (data.body == null || !data.body.is_playing) { return; }

          if (track.id === "undefined" || data.body.item.id !== track.id) {

            (checkSaved(data.body.item.id));

            scrobble = new Track(
              data.body.item.id,
              data.body.item.name,
              data.body.item.artists[0].name,
              data.body.item.duration_ms,
              data.body.timestamp,
              data.body.item.album.images[1].url,
              data.body.item.album.id
            );
            setPrevTrack(scrobble);
            sendData();
          }

          // var now = new Date().getTime();
          let progressRatio = data.body.progress_ms / data.body.item.duration_ms;

          console.log(progressRatio);
          if (
            (prevTrack.id !== track.id && progressRatio > 0.6) ||
            (track.id === "undefined")
          ) {

            console.log("the song has changed");

            console.log("prev track timestamp:", track.timestamp);
            console.log("api timestamp: ", data.body.timestamp);
            console.log(" track progress:", data.body.progress_ms);
            console.log("api track duration:", data.body.item.duration_ms);

            saveScrobble(scrobble, window.localStorage.getItem("userID"));
            setSaved(true);
            setTrack(prevTrack);
            return <NotificationCard message="Song is saved!" open={true} />;
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
      setSaved(false);
    }, [5000]);

    return () => {
      clearInterval(interval);
    }

  });
  const token = window.localStorage.getItem("accessToken")

  if (code) {
    console.log("trying to set the token");
    SetToken(code);
  }

  if (token == null || token === "undefined")
    return <Login />;

  //console.log("local storage is null but code is not");
  //window.localStorage.setItem("accessToken", accessToken);

  if (token != null && token !== "undefined") {
    return (
      <Router>
        <div style={{ /*backgroundColor: "#121212" */ }}>
          <Header spotifyApi={spotifyApi} />
          {saved ? <NotificationCard message={`${prevTrack.name} is succesfully saved!`} /> : null}
          <Routes>
            <Route path="/" element={<Main spotifyApi={spotifyApi} trackData={data} />}></Route>
            <Route path="/stats" element={<Stats spotifyApi={spotifyApi} />}></Route>
            <Route path="/stats/:id" element={<SongAnalysis spotifyApi={spotifyApi} />}></Route>
          </Routes>
        </div>
      </Router>
    );
  }



}

export default App;
