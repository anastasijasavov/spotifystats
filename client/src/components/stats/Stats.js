import { getMyScrobbles } from "../../utils/http-requests"
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect, useMemo } from "react"
import "./stats.scss";
import Report from "./Report";
import TopGenres from "../TopGenres/TopGenres";
export function Stats({ spotifyApi }) {

    const userID = window.localStorage.getItem("userID");
    const data = getMyScrobbles(userID);
    const [rows, setRows] = useState([])
    const [pageSize, setPageSize] = useState(5)
    var groups = useMemo(() => [], []);

    useEffect(() => {
        data.then(tracks => {
            for (let index = 0; index < tracks.length; index++) {
                const element = tracks[index];
                var foundIndex = groups.findIndex(e => e.id === element.track.id)

                if (groups.length === 0 || foundIndex === -1) {
                    const dummy = {
                        id: element.track.id,
                        name: element.track.name,
                        count: 1,
                        artist: element.track.artist
                    };
                    groups.push(dummy)
                }
                else groups[foundIndex].count++;

            }
            groups.sort((a, b) => b.count - a.count);
            setRows(groups);
        });
        return () => {

        }
    }, [])



    // console.log("top 10 scrobbles all time: ", groups);
    const columns = [
        { field: "name", headerName: "Name", flex: 1 },
        { field: "artist", headerName: "Artist", flex: 1 },
        { field: "count", headerName: "Frequency", flex: 1 }
    ]
    return (
        <>
            <div className="upperBody">
                <div className="topTracks">
                    <div className="topTracks-card">
                        <h3>Top tracks: </h3>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={pageSize}
                            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                            rowsPerPageOptions={[5, 10, 20]}
                        />
                    </div>
                </div>


                <TopGenres spotifyApi={spotifyApi} />
            </div>
            <Report />
        </>
    );
}
