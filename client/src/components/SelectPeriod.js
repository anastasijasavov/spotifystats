import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectAutoWidth() {
    const [period, setPeriod] = React.useState('');

    const handleChange = (event) => {
        setPeriod(event.target.value);
    };

    return (
        <div>
            <FormControl sx={{ m: 1, minWidth: 80 }}>
                <InputLabel id="demo-simple-select-autowidth-label">Period</InputLabel>
                <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={period}
                    onChange={handleChange}
                    autoWidth
                    label="Age"
                >
                    <MenuItem value={0}>
                        <em>all time</em>
                    </MenuItem>
                    <MenuItem value={7 * 24 * 60 * 60 * 1000}>last 7 days</MenuItem>
                    <MenuItem value={30 * 24 * 60 * 60 * 1000}>last month</MenuItem>
                    <MenuItem value={365 * 24 * 60 * 60 * 1000}>last year</MenuItem>
                    <MenuItem value={0}>all time</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
}
