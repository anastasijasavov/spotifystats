import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from "react";
import Tooltip from '@mui/material/Tooltip';
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import "./current-track.scss";

export default function CurrentTrack({ spotifyApi, sendData }) {

    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        setIsSaved(sendData.isSaved);
        console.log("the song is saved? ", sendData.isSaved);
    }, [sendData.track])

    //     console.log("data is empty, returning only scrobbles");
    //     return <><Scrobbles currentTrack={sendData.track} /></>;
    // }
    if (sendData.track == null || typeof sendData.track.id === "undefined") return;
    // console.log(sendData.track);

    return (
        <>
            <div className="curr-track-card">
                <Card sx={{ display: 'flex' }}>
                    <CardMedia
                        component="img"

                        image={sendData.track.album}
                        alt="album cover"
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flex: '1 0 auto' }}>
                            <Typography variant="h6" color="text.secondary" component="div">
                                Currently playing:
                            </Typography>
                            <Typography component="div" variant="h5">
                                {sendData.track.name}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                by {sendData.track.artist}
                            </Typography>
                        </CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }} className="heart-btn">

                            {sendData.track.id !== undefined ? (!isSaved ? (
                                <Tooltip title="save to spotify">
                                    <FavoriteBorderIcon onClick={() => {
                                        sendData.track.saveToSpotify(spotifyApi);
                                        setIsSaved(true);
                                    }} />
                                </Tooltip>) : (
                                <Tooltip title="unsave from spotify">
                                    <FavoriteIcon onClick={() => {
                                        sendData.track.unsaveFromSpotify(spotifyApi);
                                        setIsSaved(false);
                                    }} />
                                </Tooltip>)
                            ) : null}

                        </Box>

                    </Box>

                </Card>
            </div>

        </>
    );


}
