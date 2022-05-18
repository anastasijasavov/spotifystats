import { getMyScrobbles } from "../../utils/http-requests"
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect, useMemo } from "react"

export function Stats() {

    const userID = window.localStorage.getItem("userID");
    const data = getMyScrobbles(userID);
    const [rows, setRows] = useState([])

    var groups = useMemo(() => groups, []);
    data.then(tracks => {

        for (let index = 0; index < tracks.length; index++) {
            const element = tracks[index];
            var foundIndex = groups.findIndex(e => e.id === element.track.id)

            if (groups.length === 0 || foundIndex === -1) {
                const dummy = { id: element.track.id, name: element.track.name, count: 1 };
                groups.push(dummy)
            }
            else groups[foundIndex].count++;

        }
        groups.sort((a, b) => b.count - a.count);
    }

    );
    useEffect(() => {
        setRows(groups.slice(0, 10).map(item => {
            return {
                id: item.id,
                name: item.name,
                scrobbles: item.count,
                artist: item.artist,
                album: item.album
            }
        }));
        return () => {
            setRows([])
        }
    }, [groups])
    // console.log("top 10 scrobbles all time: ", groups);
    const columns = [
        { field: "name", headerName: "Name" },
        { field: "artist", headerName: "Artist" },
        { field: "scrobbles", headerName: "Frequency" }
    ]
    if (rows)
        return (
            <>
                <div style={{ height: "200px" }}><DataGrid rows={rows} columns={columns} /></div>
            </>
        );
}
