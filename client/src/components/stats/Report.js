import { analyzeSongs } from "../../utils/stats-requests";
import { useState, useEffect } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import "./stats.scss";

export default function Report() {
    const [report, setReport] = useState([])

    useEffect(() => {
        setReport(analyzeSongs());
        return () => {
            setReport([]);
        }
    }, [])

    return (
        <Card sx={{ minWidth: 275, maxWidth: 500 }} className="card">
            {report[0] ?
                (<CardContent>

                    <Typography variant="h3" color="text.secondary" gutterBottom>
                        Your song analysis report
                    </Typography>
                    <Typography variant="body2">

                        Your most listened songs are {report[1].acousticness > 0.5 ? "not" : ""} electrically enhanced in some way, with autotune or other non-natural sources of sounds. Your songs are usually {report[1].loudness > -20 ? " louder and have bigger sound distortion." : "calmer and sound smoother and are of greater sound quality."}
                        Your most listened songs are {report[1].energy > 0.5 ? "more energetic, faster and louder than average. " : "less energetic than usual, calmer and slower. "}.
                        Your songs are also {report[1].instrumentalness > 0.5 ? "more instrumental, with less vocals" : " more vocal, with less instrumentals. "}
                        You also like very {report[1].speechiness > 0.66 ? "very vocal recordings which are almost entirely made out of spoken words, so you probably listened to al lot of podcasts or audio books." : (report[1].speechiness > 0.33 && report[1].speechiness < 0.66 ? " vocal songs, so you probably listen to rap or other genres that contain a lot of words." : " instrumental tracks, with almost no words in them. ")}.
                        Your average tempo is around {Math.round(report[1].tempo)}BPM , while your most listened song has {Math.round(report[0].tempo)}BPM.
                        You also like very {report[1].valence > 0.5 ? "positive, cheereful and euphoric tracks." : "negative and sad tracks."}
                    </Typography>
                </CardContent>) : <div></div>
            }

        </Card>
    );
}