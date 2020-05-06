import React, { useState, useEffect } from 'react';
import PeopleIcon from '@material-ui/icons/People';
import { makeStyles } from '@material-ui/core/styles';
import { blue, pink } from '@material-ui/core/colors';
import {
  Avatar,
  Box,
  CircularProgress,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core';
import LoadingButton from '../common/LoadingButton';
import LoadingCard from '../common/LoadingCard';

import { connect } from 'react-redux';
import {
  fetchAssignedRoles,
  executeUser,
} from '../../store/actions/roomActions';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    touchAction: 'manipulation',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  box: {
    marginTop: theme.spacing(3),
  },
  roles: {
    padding: theme.spacing(1, 0, 3, 0),
    textAlign: 'center',
  },
}));

const Vote = props => {
  const {
    uid,
    roomId,
    joinUsers,
    loading,
    executeUser,
    actionDatas,
    fetchAssignedRoles,
  } = props;

  const classes = useStyles();

  const [state, setState] = useState({
    clickedUser: '',
  });

  useEffect(() => {
    fetchAssignedRoles(roomId);
  }, [Object.keys(actionDatas).join(',')]);

  const actionData = actionDatas[uid];

  // TODO: カード選択時に確認
  const MemberCards = props => {
    return Object.keys(joinUsers)
      .filter(userId => userId !== uid)
      .map((userId, index) => {
        return (
          <Grid
            item
            xs={3}
            key={index}
            onClick={() => {
              if (!actionData?.voteUserId) {
                setState({ ...state, clickedUser: userId });
                executeUser(roomId, userId);
              }
            }}
          >
            <LoadingCard
              imageName="card-back"
              isLoading={state.clickedUser === userId && loading}
              selected={actionData?.voteUserId === userId}
              disabled={
                (actionData?.voteUserId && actionData?.voteUserId !== userId) ||
                loading
              }
            />
            <Typography variant="caption">{`${joinUsers[userId].name}`}</Typography>
          </Grid>
        );
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box className={classes.paper}>
        <Avatar className={classes.avatar}>
          <PeopleIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          投票
        </Typography>
        <Box className={classes.box}>
          <Typography variant="caption">
            処刑する人をタップして投票してください。
          </Typography>
        </Box>
        <Box className={classes.box}>
          <Grid container spacing={3} className={classes.roles}>
            <MemberCards />
          </Grid>
        </Box>
        {actionData?.voteUserId && (
          <Box className={classes.box}>
            <Typography variant="body2">
              投票が完了しました。
              <br />
              他のユーザーの投票を待っています。
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

const mapStateToProps = state => {
  return {
    actionDatas: state.room.actionDatas,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAssignedRoles: (roomId, selectUserId) =>
      dispatch(fetchAssignedRoles(roomId, selectUserId)),
    executeUser: (roomId, userId) => dispatch(executeUser(roomId, userId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Vote);
