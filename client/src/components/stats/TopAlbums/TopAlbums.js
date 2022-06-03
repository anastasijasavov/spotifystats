import { useState, useEffect } from "react";
import * as React from 'react';
import Box from '@mui/material/Box';
import { Typography } from "@mui/material";
import "../../main/TopArtists/top-artists.scss"
import { getTopAlbums } from "../../../utils/http-requests";


const TopAlbums = ({ spotifyApi }) => {

    const [topAlbums, setTopAlbums] = useState([]);
    const getAlbums = async () => {
        //setTopAlbums(getTopAlbums(spotifyApi));
        setTopAlbums(await getTopAlbums(spotifyApi));
        return true;
    }


    useEffect(() => {
        getAlbums();
        return () => {
            setTopAlbums([]);
        }
    }, [])

    if (topAlbums.length > 0)
        return (
            <Box sx={{ flexGrow: 1 }} className="top-artists">
                <Typography variant="h3" >
                    Top albums
                </Typography>
                <div className="parent">
                    {topAlbums ? topAlbums.map(album => {
                        return <div className="child" key={album.id}>
                            <h4>{album.name}</h4>
                            <img src={album.url} key={album.id} alt={album.name} />
                        </div>
                    }) : ""}
                </div>
            </Box>
        )
}

export default TopAlbums