import React, { useState, useEffect } from 'react';
import JoinRoomPage from "./JoinRoomPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate
} from "react-router-dom";


export default function HomePage() {

    const [roomState, setRoomState] = useState({roomCode:null});

    useEffect(() => {
        fetch('/api/user-in-room')
            .then((response) => response.json())
            .then((data) => {
                setRoomState({
                    ...roomState,
                    roomCode: data.code,
                });
            });
    });

    const renderHomePage = () => {
        return(
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant="h3" compact="h3">
                        House Party
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="primary" to="/join" component={Link}>
                            Join A Room
                        </Button>
                        <Button color="secondary" to="/create" component={Link}>
                            Create A Room
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        );
    };

    return (
        <Router>
            <Routes>
                <Route exact path="/" element={
                    roomState.roomCode ? (<Navigate replace to={`/room/${roomState.roomCode}`} />) : (renderHomePage())
                } />
                <Route path="/join" element={<JoinRoomPage />} />
                <Route path="/create" element={<CreateRoomPage />} />
                <Route path="/room/:roomCode" element={<Room />} />
            </Routes>
        </Router>
    );
}