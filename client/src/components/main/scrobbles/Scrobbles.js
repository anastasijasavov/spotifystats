import { getMyScrobbles, removeScrobble, getMe } from "../../../utils/http-requests";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { GridActionsCellItem } from "@mui/x-data-grid-pro";
import "./scrobbles.scss";
import Tooltip from '@mui/material/Tooltip';
import { Typography } from "@mui/material";


export function Scrobbles() {
  const [rows, setRows] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  // const [timeAgo, setTimeAgo] = useState(0);
  // const [timeUnit, setTimeUnit] = useState("min");
  const columns = [
    { field: "col1", headerName: "Name", flex: 1 },
    { field: "col2", headerName: "Artist", flex: 1 },
    { field: "col3", headerName: "Scrobbled", flex: 1 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<Tooltip title="delete from history"><DeleteOutlineIcon style={{ color: "e8565d" }} /></Tooltip>}
            label="Delete"
            onClick={() => {
              removeScrobble(id);
              setRows(rows.filter(row => row.id !== id))
            }}
            color="inherit"
          />,
        ];
      },
    },
  ];
  const getTracks = () => {
    return getMyScrobbles(getMe());
  }
  useEffect(() => {

    var today = new Date();
    today = today.getTime();
    let timeAgo = 0;
    let timeUnit = "min";

    getTracks().then((tracks) => {
      console.log(tracks);
      setRows(
        tracks
          .map((track) => {
            timeAgo = (today - track.track.scrobble_id) / 60000;
            // console.table(timeAgo, today, track.track.scrobble_id);
            timeUnit = "min";
            if (timeAgo >= 60) {
              timeAgo /= 60;
              timeUnit = "h";
              if (timeAgo >= 24) {
                timeAgo /= 24;
                timeUnit = "d";
                if (timeAgo >= 30) {
                  timeAgo /= 30;
                  timeUnit = "m";
                  if (timeAgo > 12) {
                    timeAgo /= 12;
                    timeUnit = "y";
                  }
                }
              }
            }
            //console.log(timeAgo + timeUnit);
            // console.log("rows", rows);
            return {
              id: track.id,
              col1: track.track.name,
              col2: track.track.artist,
              col3: Math.floor(timeAgo) + timeUnit,
            };
          })
          .reverse()
      );
    });
    return () => {
      //console.log("rows", rows);
      setRows([]);
    };
  }, []);
  // if (track) setRows(rows.unshift(track))
  if (rows)
    return (
      <div className="scrobbles">
        <Typography variant="h3">Listening history</Typography>
        <div className="grid">
          <DataGrid
            columns={columns}
            rows={rows}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </div>
      </div>

    );
}
