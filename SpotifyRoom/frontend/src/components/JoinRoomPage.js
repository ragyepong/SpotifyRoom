import React, { useState } from 'react';
import { TextField, Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function JoinRoomPage() {

    let navigate  = useNavigate();

    const [roomState, setRoomState] = useState({roomCode:"", error:""})

    const handleVotesChange = (e) =>  {
        setRoomState({
            ...roomState,
            roomCode: e.target.value,
        });
    };

    const handleRoomButtonPress = (e) =>  {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                code: roomState.roomCode
            })
        };

        fetch('api/join-room', requestOptions)
            .then((response) => {
                if (response.ok) {
                    navigate(`/room/${roomState.roomCode}`)
                } else {
                    setRoomState({
                        ...roomState,
                        error: "Room not found.",
                    });
                }
            }).catch((error) => {
                console.log(error);
            })
    };

    return (
        <Grid container spacing={1} align="center">
            <Grid item xs={12}>
                <Typography variant="h4" component="h4">
                    Join A Room
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    error={roomState.error}
                    label="Code"
                    placeholder="Enter A Room Code"
                    value={roomState.roomCode}
                    helperText={roomState.error}
                    variant="outlined"
                    onChange={handleVotesChange}
                >
                    Join A Room
                </TextField>
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={handleRoomButtonPress} >
                    Enter Room
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="secondary" to="/" component={Link}>
                    Back
                </Button>
            </Grid>
        </Grid>
    );

}