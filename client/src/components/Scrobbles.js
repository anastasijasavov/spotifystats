import { getMyScrobbles, removeScrobble } from "../utils/http-requests";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGridPro,
  GridColumns,
  GridRowParams,
  MuiEvent,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
} from "@mui/x-data-grid-pro";

const userID = localStorage.getItem("userID");

export function Scrobbles() {
  const [rows, setRows] = useState([]);
  // const [timeAgo, setTimeAgo] = useState(0);
  // const [timeUnit, setTimeUnit] = useState("min");
  const columns = [
    { field: "col1", headerName: "Name", width: 150 },
    { field: "col2", headerName: "Artist", width: 150 },
    { field: "col3", headerName: "Scrobbled", width: 100 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<DeleteOutlineIcon />}
            label="Delete"
            onClick={() => removeScrobble(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  useEffect(() => {
    const scrobbles = getMyScrobbles(userID);
    //let rows = []

    var today = new Date();
    today = today.getTime();
    let timeAgo = 0;
    let timeUnit = "min";
    scrobbles.then((tracks) => {
      setRows(
        tracks
          .map((track) => {
            timeAgo = (today - track.track.scrobble_id) / 60000;
            console.table(timeAgo, today, track.track.scrobble_id);
            timeUnit = "min";
            if (timeAgo > 60) {
              timeAgo /= 60;
              timeUnit = "h";
              if (timeAgo > 24) {
                timeAgo /= 24;
                timeUnit = "d";
                if (timeAgo > 30) {
                  timeAgo /= 30;
                  timeUnit = "m";
                  if (timeAgo > 12) {
                    timeAgo /= 12;
                    timeUnit = "y";
                  }
                }
              }
            }
            console.log(timeAgo + timeUnit);
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
      setRows([]);
    };
  }, []);
  //console.log("rows", rows);
  return (
    <div style={{ height: "300px", width: "60%" }}>
      <DataGrid columns={columns} rows={rows} />
    </div>
  );
}
