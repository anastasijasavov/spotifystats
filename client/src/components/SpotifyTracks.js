import { useState, useEffect } from "react";
import { Track } from "../models/Track";
import { DataGrid } from "@mui/x-data-grid";

// const spotifyApi = new SpotifyWebApi({
//   clientId: "0cc65edbfc7649b087b605c605e9aade",
// });

const columns = [
  { field: "col1", headerName: "Name", width: 150 },
  { field: "col2", headerName: "Artist", width: 150 },
];
export default function SpotifyTracks({ props }) {
  // const accessToken = useAuth(code);
  const [tracks, setTracks] = useState([]);
  const [rows, setRows] = useState([]);
  //let rows = [];

  //check accessToken
  useEffect(() => {
    if (!props.accessToken) return;
    props.spotifyApi.setAccessToken(props.accessToken);
  }, [props.accessToken, props.spotifyApi]);

  //get tracks from spotify
  useEffect(() => {
    if (!props.accessToken) return;

    props.spotifyApi
      .getMySavedTracks({
        limit: 5,
        offset: 0,
      })
      .then(
        function (data) {
          console.log("saved from spotify:", data.body);
          //console.log("Done!");

          setTracks(
            data.body.items.map(
              (item) =>
                new Track(
                  item.track.id,
                  item.track.name,
                  item.track.artists[0].name,
                  item.track.duration_ms,
                  null,
                  item.track.album.name
                )
            )
          );
          setRows(
            data.body.items.map((item) => {
              return {
                id: item.track.id,
                col1: item.track.name,
                col2: item.track.artists[0].name,
              };
            })
          );
        },
        function (err) {
          console.log(
            "Something went wrong with fetching saved songs from spotify!",
            err
          );
        }
      );

    return () => {
      setTracks([]);
      setRows([]);
    };
  }, [props.accessToken, props.spotifyApi]);

  // console.log(rows);
  return (
    <div className="tracks">
      <h4>Saved from spotify</h4>
      <div style={{ height: "400px", width: "50%", marginLeft: "20px" }}>
        <DataGrid rows={rows} columns={columns} />
      </div>
      {/* <ul>
        {tracks
          ? tracks.map((track) => {
              return (
                <li key={track.id}>
                  <div className="track">
                    <h2>
                      {track.name} by {track.artist}
                    </h2>
                    <h2>{track.album}</h2>
                    <h5>
                      {track.minutes}:{track.seconds}
                    </h5>
                    <button
                      onClick={() => track.unsaveFromSpotify(props.spotifyApi)}
                    >
                      unsave
                    </button>
                  </div>
                </li>
              );
            })
          : null}
      </ul> */}
    </div>
  );
}
