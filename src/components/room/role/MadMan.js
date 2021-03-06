import React, { useState, useEffect } from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import SettingsIcon from '@material-ui/icons/Settings';
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
import { connect } from 'react-redux';

import LoadingCard from '../../common/LoadingCard';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    touchAction: 'manipulation',
  },
  roleImage: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  description: {
    margin: theme.spacing(3, 0),
  },
  roleCard: {
    maxWidth: '100%',
  },
  remainCard: {
    maxWidth: '48%',
  },
  roles: {
    padding: theme.spacing(1, 0, 3, 0),
    textAlign: 'center',
  },
}));

const MadMan = props => {
  const classes = useStyles();
  const {
    uid,
    roles,
    roomId,
    actionDatas,
    joinUsers,
    fetchAssignedRoles,
    actionState,
  } = props;
  const actionData = actionDatas[uid];

  const [state, setState] = useState({
    clickedUser: '',
  });

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
              if (!actionData.selectUserId) {
                setState({ ...state, clickedUser: userId });
                fetchAssignedRoles(roomId, userId);
              }
            }}
          >
            <LoadingCard
              imageName="card-back"
              isLoading={
                state.clickedUser === userId && actionState === 'executing'
              }
              selected={actionData?.selectUserId === userId}
              disabled={
                (actionData?.selectUserId &&
                  actionData?.selectUserId !== userId) ||
                actionState === 'executing'
              }
            />
            <Typography variant="caption">{`${joinUsers[userId].name}`}</Typography>
          </Grid>
        );
      });
  };

  return (
    <Box className={classes.paper}>
      <Box className={classes.roleImage}>
        <Typography>あなたの役職は...</Typography>
        <img
          src={`${process.env.PUBLIC_URL}/cards/${actionData.beforeRole}.png`}
          className={classes.roleCard}
          alt={actionData.beforeRole}
        />
        <Typography variant="h5" color="secondary">
          {roles[actionData.beforeRole].nameJp}
        </Typography>
      </Box>
      <Typography className={classes.description} variant="caption">
        狂人はプレイヤーに人狼がいる場合、「人狼チーム」になります。ただし、狂人が誰が人狼か知ることはできません。
        狂人が処刑されても、人狼チームが勝てば狂人も勝ちになります。狂人となったあなたは人狼が殺されないように村人を騙してください。
        しかしプレイヤーに人狼がいない場合(平和村)、狂人は「村人チーム」となるため、狂人を処刑してはいけません。平和村になるように投票しましょう。
        <br />
        <br />
        怪しいと思う人物を一人選んでください。
      </Typography>
      <Grid container spacing={2} className={classes.roles}>
        <MemberCards />
      </Grid>
    </Box>
  );
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(MadMan);
