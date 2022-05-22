import CurrentTrack from "../CurrentTrack/CurrentTrack";
// import SpotifyWebApi from "spotify-web-api-node";
// import { useRef, useState } from "react";
// import { useEffect, useMemo } from "react";

import './maintest.scss';
// import { Track } from "../../models/Track";

export default function Main({ spotifyApi, trackData }) {


  return (
    <>
      <div className="body">
        <CurrentTrack spotifyApi={spotifyApi} sendData={trackData} />
      </div>
    </>
  );
}
