import "./top-genres.scss";
import { getGenreGroups } from "../../../utils/spotifyService";
import { useState, useEffect } from "react";
import React from 'react'
import { PolarArea } from 'react-chartjs-2';
import {
    Chart as ChartJS, RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";
import { Typography } from "@mui/material";
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const TopGenres = ({ spotifyApi }) => {

    const [topGenres, setTopGenres] = useState([]);
    const [numbers, setNumbers] = useState([])
    const [labels, setLabels] = useState([])
    useEffect(() => {

        const token = window.localStorage.getItem("accessToken");
        spotifyApi.setAccessToken(token);
        let genres = [];
        let distinctGenres = [];
        spotifyApi.getMyTopArtists().then(function (data) {
            spotifyApi.getArtists(data.body.items.map(artist => artist.id))
                .then(res => {
                    genres = res.body.artists.map(artist => { return artist.genres });
                    distinctGenres = getGenreGroups(genres).slice(0, 5);
                    setTopGenres(distinctGenres);
                    setNumbers(distinctGenres.map(genre => genre.count / 20 * 100));
                    setLabels(distinctGenres.map(genre => genre.name));
                }).catch(err => console.log(err));
        }, function (err) {
            console.log('Something went wrong!', err);
        });
        return () => {
            setTopGenres([]);
        }
    }, [spotifyApi])

    return (
        <div className="top-genres">
            <Typography variant="h3">Top genres</Typography>
            <div className="polarChart">
                {topGenres ? < PolarArea
                    data={
                        {
                            labels: labels,
                            datasets: [{
                                label: "genres dataset",
                                data: numbers,
                                backgroundColor: [
                                    '#332E43',
                                    '#99DA81',
                                    '#CC5669',
                                    '#4B9F2C',
                                    '#EBC77F',
                                ],
                            }],
                            borderWidth: 1,
                        }
                    }
                    options={{
                        maintainAspectRatio: false,
                        tooltips: {
                            callbacks: {
                                label: function (ctx) {
                                    return ctx.raw.count + '%';
                                }
                            }
                        }
                    }}
                    height={400}
                    width={300}

                /> : ""}
            </div>


        </div>

    )
}

export default TopGenres;