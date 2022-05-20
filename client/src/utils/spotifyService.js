
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

export function getTopArtistsIDs(spotifyApi) {
    return spotifyApi.getMyTopArtists()
        .then(function (data) {
            console.log("gettopartistsids function returns: ", data.body.items);
            return data.body.items.map(artist => artist.id);
        }, function (err) {
            console.log('Something went wrong!', err);
        });
}


export function getTopGenres(spotifyApi) {
    let artistsIDs = [];
    getTopArtistsIDs(spotifyApi).then(artists => {
        artistsIDs = artists;
        console.log(artistsIDs);
    }).catch(err => console.log(err));

    const artists = spotifyApi.getArtists(artistsIDs).then(res => {
        console.log(res);

    }).catch(err => console.log(err));

}