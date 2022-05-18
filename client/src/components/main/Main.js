import CurrentTrack from "../CurrentTrack/CurrentTrack";
// import SpotifyTracks from "../SpotifyTracks/SpotifyTracks";
// import SpotifyWebApi from "spotify-web-api-node";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { saveUser } from "../../utils/http-requests";
import './maintest.css';
import { Track } from "../../models/Track";
import { saveScrobble } from "../../utils/http-requests";
import { trackIsSaved } from "../../utils/spotifyService";

function useInterval(callback, delay) {
  const savedCallback = useRef();
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
export default function Main({ spotifyApi }) {
  // var spotifyApi = useMemo(() => new SpotifyWebApi({
  //   clientId: "0cc65edbfc7649b087b605c605e9aade"
  // }), [])
  const [data, setData] = useState({})
  const [isSaved, setIsSaved] = useState(false);
  const [track, setTrack] = useState(new Track());
  const [songPlayedAt, setSongPlayedAt] = useState(0);

  // window.localStorage.setItem("accessToken", accessToken);

  const sendData = () => {
    console.log("hello, sad cemo da pokusamo da passujemo data", track);
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

  useInterval(() => {
    const accessToken = window.localStorage.getItem("accessToken");

    if (!accessToken) return;

    spotifyApi.getMyCurrentPlayingTrack().then(
      function (data) {
        if (data.body == null || !data.body.is_playing) { return; }

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
        setTrack(scrobble);
        sendData();
        console.log("pokusaj da se pozove data");
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
          if (trackIsSaved(spotifyApi, data.body.item.id)) setIsSaved(true);
          else setIsSaved(false);

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
  }, 5000);

  return (
    <>
      <div className="body">
        <CurrentTrack spotifyApi={spotifyApi} sendData={data} />
      </div>
    </>
  );
}
