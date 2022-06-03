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
export function Stats({ spotifyApi }) {

    const userID = getMe();
    // const [rows, setRows] = useState([])
    const [data, setData] = useState();

    async function getScrobbles() {
        // setData();
        let arr = [];
        const res = await getTopScrobbles(userID);

        for (let i = 0; i < res.length; i++) {
            const el = res[i];
            arr.push({
                x: Math.random() * 50,
                y: Math.random() * 50,
                r: el.count * 5,
                count: el.count,
                artist: el.artist,
                img: el.img,
                track: el.name
            })
            console.log(arr[i])
        }

        setData({
            datasets: [{
                label: "tracks",
                data: arr,
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            }]
        });

        console.log("data", data);

        return true;
    }
    // const [pageSize, setPageSize] = useState(5)
    useEffect(() => {
        getScrobbles();
        return () => {
            // setRows([]);
            // setData({});
        }
    }, [])

    // console.log("top 10 scrobbles all time: ", groups);
    // const columns = [
    //     { field: "name", headerName: "Name", flex: 1 },
    //     { field: "artist", headerName: "Artist", flex: 1 },
    //     { field: "count", headerName: "Frequency", flex: 1 }
    // ]
    if (data)
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
                            <Bubble options={options} data={data} width={600} height={400} />
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

