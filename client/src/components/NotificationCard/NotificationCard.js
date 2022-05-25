import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import Fade from "@mui/material/Fade";
import { useEffect } from "react";

// function SlideTransition(props) {
//     return <Slide {...props} direction="up" />;
// }

export default function NotificationCard({ message }) {
    const [state, setState] = React.useState({
        open: false,
        vertical: 'top',
        horizontal: 'right',
    });
    const { vertical, horizontal, open } = state;
    useEffect(() => {
        setState({
            open: true,
            ...state
        });
        return () => {
            setState({});
        }
    }, []);

    const handleClose = () => {
        setState({
            ...state,
            Transition: Fade,
            open: false,
        });
    };

    return (
        <div>
            <Snackbar
                open={state.open}
                onClose={handleClose}
                TransitionComponent={Slide}
                message={message}
                key={state.vertical + state.horizontal}
                anchorOrigin={{ vertical, horizontal }}
            />
        </div>
    );
}
