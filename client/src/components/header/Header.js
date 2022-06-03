
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import TrackSearchResult from "./TrackSearchResult";
import "./header.scss";
import { useState, useEffect } from "react";
import Tooltip from '@mui/material/Tooltip';
import FormControl, { useFormControl } from '@mui/material/FormControl';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '30ch',
            '&:focus': {
                width: '35ch',
            },
        },
    },
}));

export default function Header({ spotifyApi }) {
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [focus, setFocus] = useState(false)

    function handleCLick(e) {
        if (e.target.classList.contains('search')) {
            console.log('clicked on search');
            setFocus(true);
        } else {
            setFocus(false);
        }
    }
    useEffect(() => {
        window.addEventListener('click', (e) => handleCLick(e));

        return () => {
            window.removeEventListener('click', (e) => handleCLick(e));
            setFocus(false);
        }
    }, [])

    function SearchResult() {
        const { focused } = useFormControl() || {};
        if (focused) setFocus(true);

        if (focus) {
            console.log("focus on");
            return <div className="search">
                {searchResults.slice(0, 5).map((track) => (
                    <TrackSearchResult track={track} key={track.uri} clearSearch={(isClear) => { isClear ? setSearch("") : <></> }} />
                ))}
            </div>;
        }

    }

    useEffect(() => {
        if (!search) return setSearchResults([]);

        let cancel = false;
        spotifyApi.searchTracks(search).then((res) => {
            if (cancel) return;
            setSearchResults(
                res.body.tracks.items.map((track) => {
                    const smallestAlbumImage = track.album.images.reduce(
                        (smallest, image) => {
                            if (image.height < smallest.height) return image;
                            return smallest;
                        },
                        track.album.images[0]
                    );
                    return {
                        id: track.id,
                        artist: track.artists[0].name,
                        title: track.name,
                        uri: track.uri,
                        albumUrl: smallestAlbumImage.url,
                    };
                })
            );
        });

        return () => (cancel = true);
    }, [search, spotifyApi]);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <FormControl sx={{ width: "100%" }} >
                <AppBar position="static" sx={{ backgroundColor: "#332E43" }}>
                    <Toolbar>
                        <div className='links'>
                            <Link to="/" className="links">Home</Link>
                            <Link to="/stats" className="links">Stats</Link>
                        </div>

                        <Search style={{ marginLeft: "40vw", position: "absolute" }}>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <img className='close-btn' src="/close_icon.svg" alt="" onClick={() => setSearch()}></img>
                        </Search>
                        <Tooltip title="log out">
                            <LogoutIcon className="logout" onClick={() => {
                                window.localStorage.removeItem("accessToken");
                                window.localStorage.removeItem("refreshToken");
                                window.localStorage.removeItem("userID");
                                window.location = "/";
                            }} />
                        </Tooltip>
                    </Toolbar>
                </AppBar>

                <SearchResult />
            </FormControl>
        </Box >
    );
}
