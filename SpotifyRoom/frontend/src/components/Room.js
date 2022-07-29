import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material"
import CreateRoomPage from "./CreateRoomPage";


export default function Room(props) {

    let navigate  = useNavigate();
    const calledOnce = React.useRef(false);

    const [roomState, setRoomState] = useState({votesToSkip:props.votesToSkip, guestCanPause:props.guestCanPause, isHost:props.isHost, showSettings:props.showSettings, spotifyAuthenticated:props.spotifyAuthenticated});
    const { roomCode } = useParams();

    const getRoomDetails = () => {
        fetch('/api/get-room?code='+roomCode)
            .then((response) => {
                if (!response.ok) {
                    props.leaveRoomCallback();
                    navigate("/");
                }
                return response.json()
            })
            .then((data) => {
                setRoomState({
                    ...roomState,
                    votesToSkip: data.votes_to_skip,
                    guestCanPause: data.guest_can_pause,
                    isHost: data.is_host
                });
                if (data.is_host) {
                    authenticateSpotify();
                }
            });
    };

    const authenticateSpotify = () => {
        fetch('/spotify/is-authenticated').then((response) => response.json()).then((data) => {
            if (!data.Status){
                fetch('/spotify/get-auth-url').then((response) => response.json()).then((data) => {
                    window.location.replace(data.url);
                })
            }
        })
    };

    useEffect(() => {
        if (calledOnce.current) {
            return;
        } else {
            calledOnce.current = true;
        }

        getRoomDetails();
    });

    const leaveButtonPressed = (e) =>  {
        const requestOptions = {
            method: "POST",
            headers: {'Content-Type': "application/json"},
        };

        fetch('/api/leave-room', requestOptions)
            .then((response) => {
                props.leaveRoomCallback();
                navigate("/");
            });
    };

    const updateShowSettings = (value) => {
        setRoomState({
            ...roomState,
            showSettings: value
        });
    };

    const renderSettings = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <CreateRoomPage
                        update={true}
                        votesToSkip={roomState.votesToSkip}
                        guestCanPause={roomState.guestCanPause}
                        roomCode={roomCode}
                        successMessage=""
                        errorMessage=""
                        updateCallback={getRoomDetails} />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={() => updateShowSettings(false)}>
                        Close
                    </Button>
                </Grid>
            </Grid>
        );
    };

    const renderSettingsButton = () => {
        return (
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={() => updateShowSettings(true)}>
                    Settings
                </Button>
            </Grid>
        );
    };

    if (roomState.showSettings) {
        return renderSettings();
    }
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Code: {roomCode}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Votes: {roomState.votesToSkip}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Guest Can Pause: {String(roomState.guestCanPause)}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Host: {String(roomState.isHost)}
                </Typography>
            </Grid>
            {roomState.isHost ? renderSettingsButton() : null}
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" onClick={leaveButtonPressed}>
                    Leave Room
                </Button>
            </Grid>
        </Grid>
    );

} 