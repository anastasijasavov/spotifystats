import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useState } from "react";
import Tooltip from '@mui/material/Tooltip';
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import { saveScrobble } from "../../utils/http-requests";
import { Scrobbles } from "../scrobbles/Scrobbles";
// import { trackIsSaved } from "../../utils/spotifyService";
import "./current-track.scss";


export default function CurrentTrack({ spotifyApi, sendData }) {
    //const accessToken = useAuth(code);
    // const [track, setTrack] = useState(new Track());

    const [isSaved, setIsSaved] = useState(false);
    // const accessToken = window.localStorage.getItem("accessToken");
    // const [songPlayedAt, setSongPlayedAt] = useState(0);
    //check accessToken

    // useEffect(() => {
    //     if (!accessToken) return;
    //     spotifyApi.setAccessToken(accessToken);
    // }, [accessToken, spotifyApi]);


    if (sendData.track === "undefined" || sendData.track == null) {
        console.log("data is empty, returning only scrobbles");
        return <><Scrobbles currentTrack={sendData.track} /></>;
    }

    return (
        <>
            <div className="card">
                <Card sx={{ display: 'flex' }}>
                    <CardMedia
                        component="img"
                        sx={{ width: 151 }}
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

                            {sendData.track.id !== undefined ? (!sendData.isSaved ? (
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
            <Scrobbles currentTrack={sendData.track} />

        </>
    );
}
