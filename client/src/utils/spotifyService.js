
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

export function trackIsSaved(spotifyApi, id) {
    let isSaved = false;
    spotifyApi.containsMySavedTracks(id).then(
        function (data) {
            // An array is returned, where the first element corresponds to the first track ID in the query
            var trackIsInYourMusic = data.body[0];

            if (trackIsInYourMusic) {
                isSaved = true;
            } else {
                isSaved = false;
            }
        },
        function (err) {
            console.log(
                "Something went wrong with checking whether the current song is saved!",
                err
            );
        }

    );
    return isSaved;
}


/*

setRows(
            data.body.items.map((item) => {
              return {
                id: item.track.id,
                col1: item.track.name,
                col2: item.track.artists[0].name,
              };
            })
          );
*/