import React from "react";
import "react-bootstrap";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
// import { styled } from '@mui/material/styles';
import "./header.scss";
import { useNavigate } from "react-router-dom";

// const Demo = styled('div')(({ theme }) => ({
//   backgroundColor: theme.palette.background.paper,
// }));


export default function TrackSearchResult({ track, clearSearch }) {
  const navigate = useNavigate();
  function navigateToSongAnalysis(id) {
    navigate(`/stats/${id}`);
  }


  return (
    <div className="search-result">

      <div
        className="d-flex m-2 align-items-center searchResult"
        style={{ cursor: "pointer" }}
      >
        {/* <a href={track.uri}>
        <img src={track.albumUrl} alt="" style={{ height: "64px", width: "64px" }} />
        <div className="ml-3">
          <div>{track.title}</div>
          <div className="text-muted">{track.artist}</div>
        </div>
      </a> */}

        <Grid item xs={12} md={6}>
          <List dense={false}>
            <ListItem key={track.id} onClick={() => {
              // window.localStorage.setItem("track", { 'url': track.albumUrl, 'name': track.title, 'artist': track.artist });
              navigateToSongAnalysis(track.id);
              clearSearch = true;
            }}>
              <ListItemAvatar>
                <img src={track.albumUrl} alt="" />
              </ListItemAvatar>
              <ListItemText className="txt-result"
                primary={track.title}
                secondary={track.artist}
              />
            </ListItem>
          </List>
        </Grid>
      </div>
    </div>
  );
}
