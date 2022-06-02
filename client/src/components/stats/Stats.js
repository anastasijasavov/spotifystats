import { getTopScrobbles } from "../../utils/stats-requests"
// import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react"
import "./stats.scss";
import Report from "./Report";
import TopGenres from "./TopGenres/TopGenres";
import { Typography } from "@mui/material";
import TopAlbums from "./TopAlbums/TopAlbums";
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import { getMe } from "../../utils/http-requests";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const options = {
    // legend: {
    //     display: false
    // },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
            display: false
        },
        x: {
            display: false
        }
    },
    plugins: {
        tooltip: {

            callbacks: {
                label: (context) => {
                    return `${context.raw.track} by ${context.raw.artist}`;
                },

            }
        }

    }
};

async function getScrobbles(userID) {
    return await getTopScrobbles(userID);
}
export function Stats({ spotifyApi }) {

    const userID = getMe();
    const [rows, setRows] = useState([])
    const [data, setData] = useState({});
    // const [pageSize, setPageSize] = useState(5)
    useEffect(() => {
        getScrobbles(userID).then(res => {
            setRows(res);
        });


        return () => {
            setRows([]);
        }
    }, [])

    // console.log("top 10 scrobbles all time: ", groups);
    // const columns = [
    //     { field: "name", headerName: "Name", flex: 1 },
    //     { field: "artist", headerName: "Artist", flex: 1 },
    //     { field: "count", headerName: "Frequency", flex: 1 }
    // ]

    if (rows) {



        return (
            <>
                <div className="upperBody">
                    <div className="topTracks">
                        <div className="topTracks-card">
                            <Typography variant="h3">Top tracks: </Typography>
                            {/* <DataGrid
                                rows={rows}
                                columns={columns}
                                pageSize={pageSize}
                                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                rowsPerPageOptions={[5, 10, 20]}
                            /> */}
                            <Bubble options={options} data={{
                                datasets: [
                                    {
                                        labels: "tracks",
                                        data: rows.map((row) => ({
                                            x: Math.random() * 50 - 10,
                                            y: Math.random() * 50 - 10,
                                            r: row.count * 5,
                                            track: row.name,
                                            artist: row.artist,
                                            img: row.img
                                        })),
                                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                                    },
                                ],
                            }} width={600} height={400} />
                        </div>
                    </div>
                    <TopGenres spotifyApi={spotifyApi} />
                </div>
                <div className="lowerBody">
                    <TopAlbums spotifyApi={spotifyApi} />
                    <Report />
                </div>

            </>
        );
    }
}

