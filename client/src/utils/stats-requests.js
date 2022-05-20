import axios from "axios";
import { getMyScrobbles } from "./http-requests";


export function getTopGenres(spotifyApi) {

}

export function getTopArtists(spotifyApi) {

}

export function recommendPlaylist() {

}

export function getTopScrobbles(userID) {
    let groups = [];
    return getMyScrobbles(userID).then(tracks => {
        for (let index = 0; index < tracks.length; index++) {
            const element = tracks[index];
            var foundIndex = groups.findIndex(e => e.id === element.track.id)

            if (groups.length === 0 || foundIndex === -1) {
                const dummy = {
                    id: element.track.id,
                    name: element.track.name,
                    count: 1,
                    artist: element.track.artist
                };
                groups.push(dummy)
            }
            else groups[foundIndex].count++;
        }
        groups.sort((a, b) => b.count - a.count);
        console.log(groups);
        return groups;
    });

}

export function analyzeSongs() {

    const topSongCount = 10;
    const userID = window.localStorage.getItem("userID");
    const token = window.localStorage.getItem("accessToken");
    let trackIDs = "";
    let averageSongData = [];
    getTopScrobbles(userID).then(tracks => {

        tracks.slice(0, topSongCount).forEach(track => {
            trackIDs += `${track.id},`;
        });
        trackIDs = encodeURIComponent(trackIDs.substring(0, trackIDs.length - 1));
        console.log("tracksIDs: ", trackIDs);
        axios.get(`https://api.spotify.com/v1/audio-features?ids=${trackIDs}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then(res => {
            console.log(res.data.audio_features);

            let averageSong = {
                acousticness: 0,
                loudness: 0,
                energy: 0,
                danceability: 0,
                speechiness: 0,
                instrumentalness: 0,
                tempo: 0,
                time_signature: 0,
                valence: 0
            };
            let totalWeight = 0;
            for (let index = 0; index < topSongCount; index++) {

                const songCount = tracks[index].count;
                const track = res.data.audio_features[index];
                totalWeight += songCount;

                averageSong.acousticness += track.acousticness * songCount;
                averageSong.loudness += track.loudness * songCount;
                averageSong.energy += track.energy * songCount;
                averageSong.danceability += track.danceability * songCount;
                averageSong.speechiness += track.speechiness * songCount;
                averageSong.instrumentalness += track.instrumentalness * songCount;
                averageSong.tempo += track.tempo * songCount;
                averageSong.time_signature += track.time_signature * songCount;
                averageSong.valence += track.valence * songCount;
            }

            averageSong = {
                acousticness: averageSong.acousticness / totalWeight,
                loudness: averageSong.loudness / totalWeight,
                energy: averageSong.energy / totalWeight,
                danceability: averageSong.danceability / totalWeight,
                speechiness: averageSong.speechiness / totalWeight,
                instrumentalness: averageSong.instrumentalness / totalWeight,
                tempo: averageSong.tempo / totalWeight,
                time_signature: averageSong.time_signature / totalWeight,
                valence: averageSong.valence / totalWeight
            }

            averageSongData.push(res.data.audio_features[0]);
            averageSongData.push(averageSong);
            console.log("average song: ", averageSongData);
            return averageSongData;

        }).catch(err => console.log(err));
    });

}