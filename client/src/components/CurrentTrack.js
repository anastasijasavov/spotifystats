import { useState, useEffect, useRef } from "react";
import { Track } from "../models/Track";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { saveScrobble } from "../utils/http-requests";
import { Scrobbles } from "./Scrobbles";

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

export default function CurrentTrack({ spotifyApi }) {
  //const accessToken = useAuth(code);
  const [track, setTrack] = useState(new Track());
  const [isSaved, setIsSaved] = useState(false);
  const accessToken = window.localStorage.getItem("accessToken");
  const [songPlayedAt, setSongPlayedAt] = useState(0);
  //check accessToken
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken, spotifyApi]);

  useInterval(() => {
    if (!accessToken) return;

    spotifyApi.getMyCurrentPlayingTrack().then(
      function (data) {
        if (
          data.body !== null &&
          data.body.progress_ms / data.body.item.duration_ms < 0.3 && data.body.is_playing
        ) {
          console.log("namestanje pocetka pesme");
          setSongPlayedAt(data.body.timestamp);
        }

        if (data.body !== null) {
          if (
            (data.body.item.id !== track.id &&
              data.body.progress_ms / data.body.item.duration_ms > 0.5 &&
              data.body.is_playing) ||
            (track.id === undefined && data.body.is_playing)
          ) {
            var today = new Date();
            var today_ms = today.getTime();


            console.log("the song has changed");
            const scrobble = new Track(
              data.body.item.id,
              data.body.item.name,
              data.body.item.artists[0].name,
              data.body.item.duration_ms,
              data.body.timestamp,
              data.body.item.album.images[1].url
            );
            console.log("prev track timestamp:", track.timestamp);
            console.log("api timestamp: ", data.body.timestamp);
            console.log(" track progress:", data.body.progress_ms);
            console.log("api track duration:", data.body.item.duration_ms);

            setTrack(scrobble);
            let progressRatio =
              (today_ms - songPlayedAt) / data.body.progress_ms;
            if (
              progressRatio > 0.6 &&
              data.body.progress_ms / data.body.item.duration_ms > 0.5
            ) {
              console.log("song is being saved");
              saveScrobble(scrobble, window.localStorage.getItem("userID"));
            }
            spotifyApi.containsMySavedTracks([data.body.item.id]).then(
              function (data) {
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
              }
            );
          }
        }
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
  }, 5000);

  return (
    <div className="track">
      <div className="img">
        <img src={track.album} alt="" />
      </div>
      <h3>Currently listening: {track.name}</h3>
      <h5>by {track.artist}</h5>
      <h6>
        {track.minutes ? track.minutes : "-"}:{track.seconds ? track.seconds : "-"}
      </h6>
      <div>
        {track.id !== undefined ? (
          !isSaved ? (
            <button
              onClick={() => {
                track.saveToSpotify(spotifyApi);
                setIsSaved(true);
              }}
            >
              <FavoriteBorderIcon />
            </button>
          ) : (
            <button
              onClick={() => {
                track.unsaveFromSpotify(spotifyApi);
                setIsSaved(false);
              }}
            >
              <FavoriteIcon />
            </button>
          )
        ) : null}
      </div>
      <Scrobbles />
    </div>
  );
}
