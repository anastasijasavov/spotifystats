import { analyzeSongs } from "../../utils/stats-requests";
import { useState, useEffect } from "react";
import { getTopGenres } from "../../utils/spotifyService";


export default function Report() {
    const [report, setReport] = useState([])
    const [topGenres, setTopGenres] = useState([])
    useEffect(() => {
        analyzeSongs().then(data => {
            setReport(data);
            console.log(report);
        });
        setTopGenres(getTopGenres().then(data => { return data }));
        return () => {
            setReport([]);
        }
    }, [])


    console.log("report: ", report);
    return (
        <p>Acousticness of this song is which means</p>
    );
}