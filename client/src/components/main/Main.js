
import CurrentTrack from "./CurrentTrack/CurrentTrack";
import TopArtists from "./TopArtists/TopArtists";
import './maintest.scss';
import { Scrobbles } from "./scrobbles/Scrobbles";


export default function Main({ spotifyApi, trackData }) {
  return (
    <>
      <div className="body">
        <CurrentTrack spotifyApi={spotifyApi} sendData={trackData} />
        <div className="main-body">
          <Scrobbles />
          <TopArtists spotifyApi={spotifyApi} />
        </div>
      </div>
    </>
  );
}
