import CurrentTrack from "../CurrentTrack";
import SpotifyTracks from "../SpotifyTracks";
import SpotifyWebApi from "spotify-web-api-node";
import useAuth from "../../useAuth";
import { useEffect } from "react";
import { saveUser } from "../../utils/http-requests";

export default function Main({ code }) {
  const spotifyApi = new SpotifyWebApi({
    clientId: "0cc65edbfc7649b087b605c605e9aade",
  });

  const accessToken = useAuth(code);
  const props = {
    accessToken: accessToken,
    spotifyApi: spotifyApi,
  };
  useEffect(() => {
    if (accessToken) {
      spotifyApi.setAccessToken(accessToken);
      spotifyApi.getMe().then(
        function (data) {
          saveUser(data.body.id, data.body.display_name);
          console.log("success!");
          window.localStorage.setItem("userID", data.body.id);
        },
        function (err) {
          console.log("Something went wrong with saving the user!", err);
        }
      );
    }
  }, []);

  return (
    <>
      <CurrentTrack props={props} />
      <SpotifyTracks props={props} />
    </>
  );
}
