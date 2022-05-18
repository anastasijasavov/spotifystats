import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useState, useEffect, useRef } from "react";
import { Track } from "../../models/Track";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { saveScrobble } from "../../utils/http-requests";
import { Scrobbles } from "../scrobbles/Scrobbles";
import { trackIsSaved } from "../../utils/spotifyService";
import "./current-track.css";

function useInterval(callback, delay) {
    const savedCallback = useRef();
    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export default function CurrentTrack({ spotifyApi }) {
    //const accessToken = useAuth(code);
    const [track, setTrack] = useState(new Track());
    const [isSaved, setIsSaved] = useState(false);
    const accessToken = window.localStorage.getItem("accessToken");
    const [songPlayedAt, setSongPlayedAt] = useState(0);
    //check accessToken

    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken, spotifyApi]);

    useInterval(() => {
        if (!accessToken) return;

        spotifyApi.getMyCurrentPlayingTrack().then(
            function (data) {
                if (data.body == null || !data.body.is_playing) { return; }

                if (data.body.progress_ms / data.body.item.duration_ms < 0.3) {
                    console.log("namestanje pocetka pesme");
                    setSongPlayedAt(data.body.timestamp);
                }
                const scrobble = new Track(
                    data.body.item.id,
                    data.body.item.name,
                    data.body.item.artists[0].name,
                    data.body.item.duration_ms,
                    data.body.timestamp,
                    data.body.item.album.images[1].url
                );
                setTrack(scrobble);

                if (
                    (data.body.item.id !== track.id &&
                        data.body.progress_ms / data.body.item.duration_ms > 0.5) ||
                    (track.id === "undefined")
                ) {
                    var today = new Date();
                    var today_ms = today.getTime();


                    console.log("the song has changed");

                    console.log("prev track timestamp:", track.timestamp);
                    console.log("api timestamp: ", data.body.timestamp);
                    console.log(" track progress:", data.body.progress_ms);
                    console.log("api track duration:", data.body.item.duration_ms);

                    let progressRatio = (today_ms - songPlayedAt) / data.body.progress_ms;
                    console.log("ratio:", progressRatio);

                    if (progressRatio > 0.6) {
                        console.log("song is being saved");
                        saveScrobble(scrobble, window.localStorage.getItem("userID"));
                    }
                    if (trackIsSaved(spotifyApi, data.body.item.id)) setIsSaved(true);
                    else setIsSaved(false);

                }

            },
            function (err) {
                if (err.status === 401) {
                    console.log("error 401");
                    window.localStorage.removeItem("refreshToken");
                    window.localStorage.removeItem("accessToken");
                    window.location = "/";
                }
                //set refresh token
                console.log("Refreshing the token...", err);
            }
        );
    }, 5000);

    if (track.id == null) return <><Scrobbles currentTrack={track} /></>;

    return (
        <>
            <div className="card">
                <Card sx={{ display: 'flex' }}>
                    <CardMedia
                        component="img"
                        sx={{ width: 151 }}
                        image={track.album}
                        alt="album cover"
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flex: '1 0 auto' }}>
                            <Typography variant="h6" color="text.secondary" component="div">
                                Currently playing:
                            </Typography>
                            <Typography component="div" variant="h5">
                                {track.name}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                by {track.artist}
                            </Typography>
                        </CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1, pointer: "cursor" }}>

                            {track.id !== undefined ? (!isSaved ? (
                                <FavoriteBorderIcon onClick={() => {
                                    track.saveToSpotify(spotifyApi);
                                    setIsSaved(true);
                                }} />) : (
                                <FavoriteIcon onClick={() => {
                                    track.unsaveFromSpotify(spotifyApi);
                                    setIsSaved(false);
                                }} />)
                            ) : null}

                        </Box>

                    </Box>

                </Card>
            </div>
            <Scrobbles currentTrack={track} />

        </>
    );
}
