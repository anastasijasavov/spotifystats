import { getTopScrobbles } from "../../utils/stats-requests"
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react"
import "./stats.scss";
import Report from "./Report";
import TopGenres from "../TopGenres/TopGenres";

async function getScrobbles(userID) {
    return await getTopScrobbles(userID);
}
export function Stats({ spotifyApi }) {

    const userID = window.localStorage.getItem("userID");
    const [rows, setRows] = useState([])
    const [pageSize, setPageSize] = useState(5)


    useEffect(() => {
        getScrobbles(userID).then(res => setRows(res));

        return () => {
            setRows([])
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
