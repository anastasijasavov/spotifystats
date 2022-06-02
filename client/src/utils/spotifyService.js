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
            console.log(data.body.items);
            return data.body.items;
        }, function (err) {
            console.log('Something went wrong!', err);
        });
}
export function getGenreGroups(genresArr) {
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
    return genreGroup.sort((a, b) => b.count - a.count);
}
export function getTopGenres(spotifyApi) {

    let genres = [];
    let distinctGenres = [];

    spotifyApi.getMyTopArtists().then(function (data) {
        spotifyApi.getArtists(data.body.items.map(artist => artist.id))
            .then(res => {
                genres = res.body.artists.map(artist => { return artist.genres });
                distinctGenres = getGenreGroups(genres).slice(0, 5);
                console.log(distinctGenres);
                return distinctGenres;
            }).catch(err => console.log(err));
    }, function (err) {
        console.log('Something went wrong!', err);
    });

}
export function checkIfSaved(spotifyApi, id) {
    return spotifyApi.containsMySavedTracks([id]).then(
        function (data) {
            if (data.body == null) return false;
            // An array is returned, where the first element corresponds to the first track ID in the query
            var trackIsInYourMusic = data.body[0];
            if (trackIsInYourMusic) {
                console.log("song is in liked songs");
                return true;
            } else {
                console.log("song isnt in the liked songs");
                return false;
            }
        },
        function (err) {
            console.log(
                "Something went wrong with checking whether the current song is saved!",
                err
            );
            return false;
        }
    );
}

export async function getTopAlbums(spotifyApi) {
    let topAlbums = [];
    await spotifyApi.getMyTopTracks()
        .then(function (data) {
            let topTracks = data.body.items;

            topAlbums = topTracks.map(track => ({
                id: track.album.id,
                name: track.album.name,
                url: track.album.images[0].url
            }));

            for (let i = 0; i < topAlbums.length; i++) {
                const album = topAlbums[i];
                for (let j = i + 1; j < topAlbums.length; j++) {
                    const album2 = topAlbums[j];
                    if (album.id === album2.id) {
                        console.log("found duplicate", album.name);
                        topAlbums.splice(j, 1, album2);
                        console.log(topAlbums);
                    }
                }
            }
            topAlbums = topAlbums.slice(0, 9);
        }, function (err) {
            console.log('Something went wrong!', err);
        });
    return topAlbums;
}