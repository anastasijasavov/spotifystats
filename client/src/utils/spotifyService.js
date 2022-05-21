
export function getSavedTracks(off, spotifyApi, limit) {

    return spotifyApi
        .getMySavedTracks({
            limit: limit,
            offset: off,
        })
        .then(
            function (res) {
                //console.log("saved from spotify:", data.body.items);
                //console.log("Done!");

                // setTracks(
                //   data.body.items.map(
                //     (item) =>
                //       new Track(
                //         item.track.id,
                //         item.track.name,
                //         item.track.artists[0].name,
                //         item.track.duration_ms,
                //         null,
                //         item.track.album.name
                //       )
                //   )
                // );
                return res.body.items;

            },
            function (err) {
                console.log(
                    "Something went wrong with fetching saved songs from spotify!",
                    err
                );
            }
        );
}


export function getTopArtists(spotifyApi) {
    return spotifyApi.getMyTopArtists()
        .then(function (data) {
            return data.body.items;
        }, function (err) {
            console.log('Something went wrong!', err);
        });
}

function getTopArtistsIDs(spotifyApi) {
    return spotifyApi.getMyTopArtists()
        .then(function (data) {
            console.log("get top artists ids function returns: ", data.body.items);
            return data.body.items.map(artist => artist.id);
        }, function (err) {
            console.log('Something went wrong!', err);
        });
}

function getGenreGroups(genresArr) {
    let genreGroup = [];
    for (let index = 0; index < genresArr.length; index++) {
        const genres = genresArr[index];
        for (let j = 0; j < genres.length; j++) {
            const genre = genres[j];
            const found = genreGroup.findIndex(e => e.name === genre);
            if (genreGroup.length === 0 || found === -1) {
                genreGroup.push({ name: genre, count: 1 })
            } else {
                genreGroup[found].count++;
            }
        }
    }
    console.log("genre group", genreGroup);
    return genreGroup.sort((a, b) => b.count - a.count);
}
export function getTopGenres(spotifyApi) {

    let genres = [];
    let distinctGenres = [];
    return getTopArtistsIDs(spotifyApi).then(artists => {

        return spotifyApi.getArtists(artists).then(res => {
            console.log("res", res);
            genres = res.body.artists.map(artist => { return artist.genres });
            console.log("genres", genres);
            distinctGenres = getGenreGroups(genres);
            console.log(distinctGenres);
        }).catch(err => console.log(err));

    }).catch(err => console.log(err));


}