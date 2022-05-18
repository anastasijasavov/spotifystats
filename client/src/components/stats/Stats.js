import { getMyScrobbles } from "../../utils/http-requests"
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect, useMemo } from "react"
import SpotifyTracks from "../SpotifyTracks/SpotifyTracks";
import "./stats.css";

export function Stats({ spotifyApi }) {

    const userID = window.localStorage.getItem("userID");
    const data = getMyScrobbles(userID);
    const [rows, setRows] = useState([])

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
            setRows(groups.slice(0, 10));
            // console.log("grupe", groups);
        });
        return () => {

        }
    }, [])



    // console.log("top 10 scrobbles all time: ", groups);
    const columns = [
        { field: "name", headerName: "Name", width: 200 },
        { field: "artist", headerName: "Artist", width: 200 },
        { field: "count", headerName: "Frequency", width: 100 }
    ]
    return (
        <>
            <SpotifyTracks spotifyApi={spotifyApi} />


            <div className="grid">
                <h3>Top tracks: </h3>
                <DataGrid rows={rows} columns={columns} />
            </div>
        </>
    );
}
