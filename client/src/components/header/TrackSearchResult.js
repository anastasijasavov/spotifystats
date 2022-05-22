import React from "react";
import "react-bootstrap";

export default function TrackSearchResult({ track }) {
  return (
    <div
      className="d-flex m-2 align-items-center searchResult"
      style={{ cursor: "pointer" }}
    >
      <a href={track.uri}>
        <img src={track.albumUrl} alt="" style={{ height: "64px", width: "64px" }} />
        <div className="ml-3">
          <div>{track.title}</div>
          <div className="text-muted">{track.artist}</div>
        </div>
      </a>
    </div>
  );
}
