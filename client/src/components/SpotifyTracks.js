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

export default function SpotifyTracks({ spotifyApi }) {

  // const accessToken = useAuth(code);
  const [rows, setRows] = useState([]);
  //let rows = [];
  //check accessToken
  const accessToken = window.localStorage.getItem("accessToken");
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken, spotifyApi]);

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
              new Track(id).unsaveFromSpotify(spotifyApi);
              setRows(rows.filter(item => item.id !== id))
              // const index = rows.findIndex(e => e.id === id);

              const tracks = getSavedTracks(5, spotifyApi, 1);
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
    if (!accessToken) return;
    const tracks = getSavedTracks(0, spotifyApi, 5);
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
  }, [accessToken, spotifyApi]);


  // console.log(rows);
  return (
    <div className="tracks">
      <h4>Saved from spotify</h4>
      <div style={{ height: "400px", width: "50%", marginLeft: "20px" }}>
        <DataGrid rows={rows} columns={columns} />
      </div>

    </div>
  );
}
