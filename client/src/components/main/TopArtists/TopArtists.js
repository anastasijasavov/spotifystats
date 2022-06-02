import "./top-artists.scss";
import { useState, useEffect } from "react";
import * as React from 'react';
import Box from '@mui/material/Box';
import { Typography } from "@mui/material";


const TopArtists = ({ spotifyApi }) => {
    const [topArtists, setTopArtists] = useState([]);
    useEffect(() => {
        spotifyApi.getMyTopArtists()
            .then(function (data) {
                setTopArtists(data.body.items.slice(0, 9));
            }, function (err) {
                console.log('Something went wrong!', err);
            });
        return () => {
            setTopArtists([])
        }
    }, [spotifyApi])

    return (
        <Box sx={{ flexGrow: 1 }} className="top-artists">
            <Typography variant="h3" >
                Top artists
            </Typography>
            <div className="parent">
                {topArtists ? topArtists.map(artist => {
                    return <div className="child" key={artist.id}>
                        <img src={artist.images[2].url} key={artist.id} alt={artist.name} />
                        <a href={artist.external_urls.spotify}><h4>{artist.name}</h4></a>
                    </div>
                }) : ""}
            </div>
        </Box>
    )
}

export default TopArtists