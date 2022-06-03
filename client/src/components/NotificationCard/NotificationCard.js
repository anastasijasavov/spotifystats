import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import Fade from "@mui/material/Fade";
import { useEffect } from "react";

// function SlideTransition(props) {
//     return <Slide {...props} direction="up" />;
// }

export default function NotificationCard({ message, open }) {


    const [state, setState] = React.useState({
        open: false,
        vertical: 'top',
        horizontal: 'right',
    });
    const { vertical, horizontal } = state;
    const handleOpen = () => {
        setState({
            open: true,
            ...state
        });
    };
    useEffect(() => {
        handleOpen();

        return () => {
            setState({})
        }
    }, [])


    const handleClose = () => {
        setState({
            ...state,
            Transition: Fade,
            open: false,
        });
    };
    if (!message) return;

    return (
        <div>
            <Snackbar
                open={open}
                onClose={handleClose}
                TransitionComponent={Slide}
                message={message}
                key={state.vertical + state.horizontal}
                anchorOrigin={{ vertical, horizontal }}
            />
        </div>
    );
}
