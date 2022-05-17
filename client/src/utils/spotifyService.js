
export function getSavedTracks(off, spotifyApi) {

    return spotifyApi
        .getMySavedTracks({
            limit: 5,
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