import "./top-genres.scss";
import { getGenreGroups } from "../../utils/spotifyService";
import { useState, useEffect } from "react";
import React from 'react'
import { PolarArea } from 'react-chartjs-2';
import {
    Chart as ChartJS, RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const TopGenres = ({ spotifyApi }) => {

    const [topGenres, setTopGenres] = useState([]);
    const [numbers, setNumbers] = useState([])
    const [labels, setLabels] = useState([])
    useEffect(() => {


        let genres = [];
        let distinctGenres = [];
        spotifyApi.getMyTopArtists().then(function (data) {
            spotifyApi.getArtists(data.body.items.map(artist => artist.id))
                .then(res => {
                    genres = res.body.artists.map(artist => { return artist.genres });
                    distinctGenres = getGenreGroups(genres).slice(0, 5);
                    console.log(distinctGenres);
                    setTopGenres(distinctGenres);
                    setNumbers(distinctGenres.map(genre => genre.count));
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
        <div>
            <h3>Top genres</h3>
            <div className="polarChart">
                {topGenres ? < PolarArea
                    data={
                        {
                            labels: labels,
                            datasets: [{
                                label: "genres dataset",
                                data: numbers,

                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.5)',
                                    'rgba(54, 162, 235, 0.5)',
                                    'rgba(255, 206, 86, 0.5)',
                                    'rgba(75, 192, 192, 0.5)',
                                    'rgba(153, 102, 255, 0.5)',
                                ],
                            }],
                            borderWidth: 1,
                        }
                    }
                    options={{
                        maintainAspectRatio: false
                    }}
                    height={400}
                    width={300}

                /> : ""}
            </div>


        </div>

    )
}

export default TopGenres;