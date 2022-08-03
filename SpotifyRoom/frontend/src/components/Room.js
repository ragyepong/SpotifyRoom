import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material"
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";


export default function Room(props) {

    let navigate  = useNavigate();
    const calledOnce = React.useRef(false);

    const [roomState, setRoomState] = useState({
        votesToSkip:props.votesToSkip,
        guestCanPause:props.guestCanPause,
        isHost:props.isHost,
        showSettings:props.showSettings,
        spotifyAuthenticated:props.spotifyAuthenticated,
        song: {}});
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
                setRoomState(roomState => ({
                    ...roomState,
                    votesToSkip: data.votes_to_skip,
                    guestCanPause: data.guest_can_pause,
                    isHost: data.is_host
                }));
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
                setRoomState(roomState => ({
                    ...roomState,
                    spotifyAuthenticated: True
                }));
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
        const interval = setInterval(() => {
            getCurrentSong();
          }, 1000);

        return () => clearInterval(interval);
      }, []);

    const getCurrentSong = () => {
        fetch('/spotify/current-song').then((response) => {
            if (!response.ok) {
                return {};
            } else {
                return response.json();
            }
        }).then((data) => {
            setRoomState(roomState => ({
                ...roomState,
                song: data
            }));
            console.log(data);
        })
    }

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
        setRoomState(roomState => ({
            ...roomState,
            showSettings: value
        }));
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
            <MusicPlayer {...roomState.song} />
            {roomState.isHost ? renderSettingsButton() : null}
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" onClick={leaveButtonPressed}>
                    Leave Room
                </Button>
            </Grid>
        </Grid>
    );

} 