import React from 'react'
import { analyzeSong, getTrackById } from '../../../utils/stats-requests'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { checkIfSaved } from '../../../utils/spotifyService'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import "./search-result.scss";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Tooltip from '@mui/material/Tooltip';
import { Track } from "../../../models/Track";

export function SongAnalysis({ spotifyApi }) {

    const params = useParams();
    const [report, setReport] = useState({})
    const [track, setTrack] = useState({})
    const [saved, setSaved] = useState(false);

    const getAnalyzeSongRes = async () => {
        setReport(await analyzeSong(params.id));
    }

    const getIfSaved = async () => {
        setSaved(await checkIfSaved(spotifyApi, params.id));
    }


    useEffect(() => {

        getAnalyzeSongRes();
        getTrackById(params.id).then(res => setTrack(res));
        getIfSaved();

        return () => {
            setReport({})
            setSaved(false);
        }
    }, [params.id])

    if (report && Object.keys(track).length !== 0) {
        return (
            <>
                <div className="search-res">
                    <div className="track-info">
                        <h3>{track.name}</h3>
                        <img src={track.album.images[0].url} alt="" />
                        <h3>by {track.artists[0].name}</h3>
                        <a href={track.external_urls.spotify}>Go to spotify</a>

                        <div className="saveBtn">
                            {saved ? <Tooltip title="unsave from spotify">
                                <FavoriteIcon onClick={() => {
                                    new Track(params.id, null, null, null, null, null).unsaveFromSpotify(spotifyApi);
                                    setSaved(false);
                                }} />
                            </Tooltip> :
                                <Tooltip title="save to spotify">
                                    <FavoriteBorderIcon onClick={() => {
                                        new Track(params.id, null, null, null, null, null).saveToSpotify(spotifyApi);
                                        setSaved(true);
                                    }} />
                                </Tooltip>
                            }
                        </div>
                    </div>
                    <Card sx={{ minWidth: 275, maxWidth: 500 }} className="track-report card">

                        <Typography variant="h3" color="text.secondary" gutterBottom >
                            Song analysis report
                        </Typography>
                        <CardContent>

                            <Typography variant="body2" className="report-body">
                                This song is <span>{report.acousticness > 0.5 ? "not" : ""} electrically enhanced </span>in some way, with autotune or other non-natural sources of sounds. The song is <span>{report.loudness > -20 ? " louder and has greater sound distortion." : "calmer and sounds smoother and is of greater sound quality."}</span>
                                It's also <span>{report.energy > 0.5 ? " energetic, faster and louder than average, " : "less energetic than usual, calmer and slower, "}</span>
                                <span>{report.instrumentalness > 0.5 ? " more instrumental, with less vocals " : " more vocal, with less instrumentals "}</span>
                                and is also  <span>{report.speechiness > 0.66 ? "very vocal and is almost entirely made out of spoken words, so it's probably a podcast or an audio book." : (report.speechiness > 0.33 && report.speechiness < 0.66 ? " vocal , so it's genre is probably rap or some other genre that contains a lot of words." : " instrumental, with almost no words in them. ")}</span>
                                The tempo is around <span>{Math.round(report.tempo)}BPM. </span>
                                It's very <span>{report.valence > 0.5 ? "positive, cheereful and euphoric too." : "negative and sad."}</span>
                            </Typography>
                        </CardContent>

                    </Card>
                </div>
            </>
        )
    }
}
