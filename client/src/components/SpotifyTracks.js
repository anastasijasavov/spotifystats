import { useState, useEffect } from "react";
import { Track } from "../models/Track";
import { DataGrid } from "@mui/x-data-grid";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  GridActionsCellItem,
} from "@mui/x-data-grid-pro";
import { getSavedTracks } from "../utils/spotifyService";
// const spotifyApi = new SpotifyWebApi({
//   clientId: "0cc65edbfc7649b087b605c605e9aade",
// });

export default function SpotifyTracks({ props }) {

  // const accessToken = useAuth(code);
  const [rows, setRows] = useState([]);
  //let rows = [];
  //check accessToken
  useEffect(() => {
    if (!props.accessToken) return;
    props.spotifyApi.setAccessToken(props.accessToken);
  }, [props.accessToken, props.spotifyApi]);

  const columns = [
    { field: "col1", headerName: "Name", width: 150 },
    { field: "col2", headerName: "Artist", width: 150 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<FavoriteIcon />}
            label="Unsave"
            onClick={() => {
              new Track(id).unsaveFromSpotify(props.spotifyApi);
              //setRows(rows.filter(item => item.id !== id))

              const tracks = getSavedTracks(1, props.spotifyApi);
              //var promise = Promise.resolve(tracks);
              //ne radi, pokaze stare saved pesme
              tracks.then(items => {
                setRows(items.map((item) => {
                  return {
                    id: item.track.id,
                    col1: item.track.name,
                    col2: item.track.artists[0].name,
                  };
                }));
              })

            }}
            color="inherit"
          />,
        ];
      },
    },
  ];

  //get tracks from spotify
  useEffect(() => {
    if (!props.accessToken) return;
    const tracks = getSavedTracks(0, props.spotifyApi);
    console.log("saved from spotify", tracks);
    tracks.then(items => {
      setRows(items.map((item) => {
        return {
          id: item.track.id,
          col1: item.track.name,
          col2: item.track.artists[0].name,
        };
      }));
    })

    return () => {
      // setTracks([]);
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
