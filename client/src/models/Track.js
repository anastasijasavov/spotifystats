
export class Track {
  constructor(id, name, artist, duration, timestamp, album, album_id) {
    this.id = id;
    this.name = name;
    this.artist = artist;
    this.duration = duration;
    this.album = album;
    this.scrobble_id = timestamp;
    this.minutes = Math.floor(this.duration / 60000);
    this.seconds = Math.round((this.duration / 1000) % 60);
    this.album_id = album_id;
  }

  saveToSpotify(spotify) {
    spotify.addToMySavedTracks([this.id]).then(
      function (data) {
        console.log("Saved track!");
        //change the button, i.e. boolean value to true
        //update the list of tracks from spotify,
      },
      function (err) {
        console.log(
          "Something went wrong with saving the track to spotify!",
          err
        );
      }
    );
  }
  unsaveFromSpotify(spotify) {
    spotify.removeFromMySavedTracks([this.id]).then(
      function (data) {
        console.log("Removed from saved tracks!");
        //change the track boolean isSaved to false
        //update the list of saved tracks from
      },
      function (err) {
        console.log("Something went wrong with unsaving!", err);
      }
    );
  }
}
