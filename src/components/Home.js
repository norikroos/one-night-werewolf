import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  TextField,
  Grid,
  Typography,
  Container,
} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import { makeStyles } from '@material-ui/core/styles';
import SignOutLink from './layout/SignOutLink';
import LoadingButton from './common/LoadingButton';

import { connect } from 'react-redux';
import {
  resetActiveRoom,
  createRoom,
  joinRoom,
} from '../store/actions/roomActions';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(4),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Home = props => {
  const classes = useStyles();
  const [state, setState] = useState({
    roomName: '',
    roomId: '',
  });

  const {
    activeRoomId,
    resetActiveRoom,
    createRoom,
    joinRoom,
    creating,
    joining,
  } = props;
  console.log(activeRoomId);

  useEffect(() => {
    resetActiveRoom();
  }, [activeRoomId]);

  if (!creating && !joining && activeRoomId)
    return <Redirect to={`/room/${activeRoomId}`} />;

  const handleChange = event => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleCreate = event => {
    event.preventDefault();
    createRoom(state.roomName);
  };

  const handleJoin = event => {
    event.preventDefault();
    joinRoom(state.roomId);
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <SignOutLink />
        <Avatar className={classes.avatar}>
          <HomeIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Home
        </Typography>
        <form className={classes.form} onSubmit={handleCreate} noValidate>
          <Typography>新しくルームを作成する</Typography>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                variant="filled"
                margin="normal"
                required
                fullWidth
                id="roomName"
                label="ルーム名を入力"
                name="roomName"
                autoComplete="rname"
                autoFocus
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={creating || joining}
                text="作成"
                isLoading={creating}
              />
            </Grid>
          </Grid>
        </form>

        <form className={classes.form} onSubmit={handleJoin} noValidate>
          <Typography>既存ルームに参加する</Typography>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                variant="filled"
                margin="normal"
                required
                fullWidth
                id="roomId"
                label="ルームIDを入力"
                name="roomId"
                autoComplete="rid"
                autoFocus
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={joining || creating}
                text="参加"
                isLoading={joining}
              />
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

const mapStateToProps = state => {
  return {
    activeRoomId: state.room.id,
    auth: state.firebase.auth,
    creating: state.room.creating,
    joining: state.room.joining,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    resetActiveRoom: () => dispatch(resetActiveRoom()),
    createRoom: roomName => dispatch(createRoom(roomName)),
    joinRoom: roomId => dispatch(joinRoom(roomId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
