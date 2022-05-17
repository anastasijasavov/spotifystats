import { getMyScrobbles } from "../../utils/http-requests"

export function Stats() {

    const userID = window.localStorage.getItem("userID");
    const data = getMyScrobbles(userID);

    var groups = [];

    data.then(tracks => {

        for (let index = 0; index < tracks.length; index++) {
            const element = tracks[index];

            if (groups.length === 0) {
                const dummy = { id: element.track.id, count: 1 };
                groups.push(dummy)
            }
            else {
                var foundIndex = groups.findIndex(e => e.id === element.track.id)
                if (foundIndex !== -1) {
                    groups[foundIndex].count++;
                }
                else {
                    const dummy = { id: element.track.id, count: 1 };
                    groups.push(dummy)
                }
            }
        }
        groups.sort((a, b) => b.count - a.count);
    }
    );
    console.log("scrobbles all time: ", groups);

    return (
        <>
            <div>{groups}</div>
        </>
    );
}
