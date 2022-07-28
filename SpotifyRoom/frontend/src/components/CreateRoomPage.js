import React, { useState } from 'react';
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import { Link } from "react-router-dom";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useNavigate } from "react-router-dom";
import { Collapse } from "@mui/material";
import { Alert } from "@mui/lab";

export default function CreateRoomPage(props) {
    let navigate  = useNavigate();

    const [roomState, setRoomState] = useState({
                                        votesToSkip:props.votesToSkip,
                                        guestCanPause:props.guestCanPause,
                                        update:props.update, roomCode:props.roomCode,
                                        updateCallback: props.updateCallback,
                                        successMessage: props.successMessage,
                                        errorMessage: props.errorMessage
                                    })

    const handleVotesChange = (e) =>  {
        setRoomState({
            ...roomState,
            votesToSkip: e.target.value,
        });
    };

    const handleGuestCanPauseChange = (e) =>  {
        setRoomState({
            ...roomState,
            guestCanPause: e.target.value === 'true' ? true : false,
        });
    };

    const handleCreateRoomButtonPress = async() =>  {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip: roomState.votesToSkip,
                guest_can_pause: roomState.guestCanPause,
            }),
        };
        fetch('/api/create-room', requestOptions).then((response) =>
            response.json()
        ).then((data) => navigate("/room/" + data.code));
    };

    const handleUpdateRoomButtonPress = async() =>  {
        const requestOptions = {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip: roomState.votesToSkip,
                guest_can_pause: roomState.guestCanPause,
                code: roomState.roomCode
            }),
        };
        fetch('/api/update-room', requestOptions).then((response) => {
            if (response) {
                setRoomState({
                    ...roomState,
                    successMessage: "Room updated successfully!",
                });
            } else {
                 setRoomState({
                    ...roomState,
                    errorMessage: "Error updating room...",
                });
            }
            props.updateCallback();
        });
    };

    const renderCreateButtons = () =>{
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={handleCreateRoomButtonPress}>
                        Create A Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" to="/" component={Link}>
                        Back
                    </Button>
                </Grid>
            </Grid>
        )
    };

    const renderUpdateButtons = () =>{
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={handleUpdateRoomButtonPress}>
                        Update Room
                    </Button>
                </Grid>
            </Grid>
        )
    };

    const title = roomState.update ? "Update Room" : "Create A Room";

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Collapse in={roomState.errorMessage != "" || roomState.successMessage != ""}>
                    {roomState.successMessage != "" ? (<Alert
                                                        severity="success"
                                                        onClose={() => {
                                                            setRoomState({
                                                                ...roomState,
                                                                successMessage: "",
                                                            });
                                                        }}>
                                                            {roomState.successMessage}
                                                        </Alert>) :
                                                    (<Alert
                                                        severity="error"
                                                        onClose={() => {
                                                            setRoomState({
                                                                ...roomState,
                                                                errorMessage: "",
                                                            });
                                                    }}>
                                                        {roomState.errorMessage}
                                                    </Alert>)}
                </Collapse>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography component='h4' variant='h4'>
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText>
                        <div align="center">Guest control Of Playback State</div>
                    </FormHelperText>
                    <RadioGroup row defaultValue={props.guestCanPause.toString()} onChange={handleGuestCanPauseChange}>
                        <FormControlLabel
                            value="true"
                            control={<Radio color="primary" />}
                            label="Play/Pause"
                            labelPlacement="bottom" />

                        <FormControlLabel
                            value="false"
                            control={<Radio color="secondary" />}
                            label="No Control"
                            labelPlacement="bottom" />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl>
                    <TextField
                        required={true}
                        type="number"
                        onChange={handleVotesChange}
                        defaultValue={roomState.votesToSkip}
                        inputProps={{
                            min: 1,
                            style: {textAlign: "center"},
                        }}
                    />
                    <FormHelperText>
                        <div align="center">
                            Votes Required To Skip Song
                        </div>
                    </FormHelperText>
                </FormControl>
            </Grid>
            {roomState.update ? renderUpdateButtons() : renderCreateButtons()}
        </Grid>
    );
}

CreateRoomPage.defaultProps = {
    votesToSkip: 2,
    guestCanPause: true,
    update: false,
    roomCode: null,
    successMessage: "",
    errorMessage: "",
    updateCallback: () => {}
};