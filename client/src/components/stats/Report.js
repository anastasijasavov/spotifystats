import { analyzeSongs } from "../../utils/stats-requests";
import { useState, useEffect } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import "./stats.scss";

export default function Report() {
    const [report, setReport] = useState([])

    useEffect(() => {
        analyzeSongs().then(res => {
            // if(res !== "undefined"){
            setReport(res);
            console.log("report", report);
            // }
        });

        // console.log(songsReport);
        return () => {
            setReport([]);
        }
    }, [])

    if (report[1]) {
        return (
            <Card sx={{ minWidth: 275, maxWidth: 500 }} className="card">

                <CardContent>

                    <Typography variant="h3" color="text.secondary" gutterBottom >
                        Your song analysis report
                    </Typography>
                    <Typography variant="body2" className="report-body">
                        Your most listened songs are <span>{report[1].acousticness > 0.5 ? "not" : ""} electrically enhanced </span>in some way, with autotune or other non-natural sources of sounds. Your songs are usually <span>{report[1].loudness > -20 ? " louder and have greater sound distortion." : "calmer and sound smoother and are of greater sound quality."}</span>
                        Your most listened songs are <span>{report[1].energy > 0.5 ? " energetic, faster and louder than average. " : "less energetic than usual, calmer and slower. "}</span>
                        Your songs are also <span>{report[1].instrumentalness > 0.5 ? "more instrumental, with less vocals" : " more vocal, with less instrumentals. "}</span>
                        You also like very <span>{report[1].speechiness > 0.66 ? "very vocal recordings which are almost entirely made out of spoken words, so you probably listened to al lot of podcasts or audio books." : (report[1].speechiness > 0.33 && report[1].speechiness < 0.66 ? " vocal songs, so you probably listen to rap or other genres that contain a lot of words." : " instrumental tracks, with almost no words in them. ")}</span>
                        The average tempo of the songs is around <span>{Math.round(report[1].tempo)}BPM </span>, while your most listened song has <span>{Math.round(report[0].tempo)}BPM.</span>
                        You also like very <span>{report[1].valence > 0.5 ? "positive, cheereful and euphoric tracks." : "negative and sad tracks."}</span>
                    </Typography>
                </CardContent>

            </Card>
        );
    }
}