import CurrentTrack from "../CurrentTrack/CurrentTrack";
// import SpotifyWebApi from "spotify-web-api-node";
// import { useRef, useState } from "react";
// import { useEffect, useMemo } from "react";

import './maintest.scss';
// import { Track } from "../../models/Track";

export default function Main({ spotifyApi, trackData }) {
  // var spotifyApi = useMemo(() => new SpotifyWebApi({
  //   clientId: "0cc65edbfc7649b087b605c605e9aade"
  // }), [])

  // const [data, setData] = useState({})
  // const [isSaved, setIsSaved] = useState(false);
  // const [track, setTrack] = useState(new Track());
  // const [songPlayedAt, setSongPlayedAt] = useState(0);

  // const track = useMemo(() => new Track(), []);
  // window.localStorage.setItem("accessToken", accessToken);


  // const sendData = () => {
  //   console.log("hello, sad cemo da pokusamo da passujemo data", track, isSaved);
  //   setData({
  //     isSaved: trackData.isSaved,
  //     track: trackData.track,
  //   });
  // }



  return (
    <>
      <div className="body">
        <CurrentTrack spotifyApi={spotifyApi} sendData={trackData} />
      </div>
    </>
  );
}
