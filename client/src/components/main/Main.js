import CurrentTrack from "../CurrentTrack/CurrentTrack";
import SpotifyTracks from "../SpotifyTracks/SpotifyTracks";
import SpotifyWebApi from "spotify-web-api-node";
import { useEffect, useMemo } from "react";
import { saveUser } from "../../utils/http-requests";
import './maintest.css';

export default function Main() {

  var spotifyApi = useMemo(() => new SpotifyWebApi({
    clientId: "0cc65edbfc7649b087b605c605e9aade"
  }), [])

  const accessToken = window.localStorage.getItem("accessToken");
  // window.localStorage.setItem("accessToken", accessToken);

  useEffect(() => {
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
  }, [accessToken, spotifyApi]);

  return (
    <>
      <div className="body">
        <CurrentTrack spotifyApi={spotifyApi} />
        <SpotifyTracks spotifyApi={spotifyApi} />
      </div>
    </>
  );
}
