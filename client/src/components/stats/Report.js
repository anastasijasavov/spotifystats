import { analyzeSongs } from "../../utils/stats-requests";
import { useMemo } from "react";

export default function Report() {
    const report = useMemo(() => analyzeSongs(), [])
    console.log(report);
    return (
        <p>Acousticness of this song is which means</p>
    );
}