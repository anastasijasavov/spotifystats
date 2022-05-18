import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import Fade from "@mui/material/Fade";


function SlideTransition(props) {
    return <Slide {...props} direction="up" />;
}

export default function NotificationCard({ message }) {
    const [state, setState] = React.useState({
        open: false,
        Transition: Fade,
    });

    const handleClick = (Transition) => () => {
        setState({
            open: true,
            Transition,
        });
    };

    const handleClose = () => {
        setState({
            ...state,
            open: false,
        });
    };

    return (
        <div>
            <Button onClick={handleClick(SlideTransition)}>Slide Transition</Button>
            <Snackbar
                open={state.open}
                onClose={handleClose}
                TransitionComponent={state.Transition}
                message={message}
                key={state.Transition.name}
            />
        </div>
    );
}
