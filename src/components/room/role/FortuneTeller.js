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

const FortuneTeller = props => {
  const classes = useStyles();
  const {
    uid,
    roles,
    roomId,
    actionDatas,
    joinUsers,
    fetchAssignedRoles,
  } = props;
  const actionData = actionDatas[uid];
  console.log(actionData);
  console.log(roles);
  console.log(roles[actionData.beforeRole]);

  const MemberRoleCards = Object.keys(joinUsers)
    .filter(userId => userId !== uid)
    .map((userId, index) => {
      const roleName = actionDatas[userId]?.beforeRole || 'card-back';
      return (
        <Grid item xs={3} onClick={() => fetchAssignedRoles(roomId, userId)}>
          <img
            src={`${process.env.PUBLIC_URL}/cards/${roleName}.png`}
            className={classes.roleCard}
          />
          <Typography variant="caption">{`${joinUsers[userId].name}`}</Typography>
        </Grid>
      );
    });

  const OtherRoleCards = (
    <Grid item xs={3} onClick={() => fetchAssignedRoles(roomId, 'others')}>
      <div>
        <img
          src={`${process.env.PUBLIC_URL}/cards/${
            actionDatas['NoUser1']?.beforeRole || 'card-back'
          }.png`}
          className={classes.remainCard}
        />
      </div>
      <div>
        <img
          src={`${process.env.PUBLIC_URL}/cards/${
            actionDatas['NoUser2']?.beforeRole || 'card-back'
          }.png`}
          className={classes.remainCard}
        />
      </div>
      <Typography variant="caption">{`残りのカード`}</Typography>
    </Grid>
  );
  return (
    <Box className={classes.paper}>
      <Box className={classes.roleImage}>
        <Typography>あなたの役職は...</Typography>
        <img
          src={`${process.env.PUBLIC_URL}/cards/${actionData.beforeRole}.png`}
          className={classes.roleCard}
          alt={actionData.beforeRole}
        />
        <Typography variant="h5">
          {roles[actionData.beforeRole].nameJp}
        </Typography>
      </Box>
      <Typography className={classes.description} variant="caption">
        占い師はプレイヤーの役職、もしくは選ばれていない残りの役職を見ることができます。
        <br />
        占いたいカードをタップして役職を確認してください。
      </Typography>
      <Typography variant="h6">占う</Typography>
      <Grid container spacing={2} className={classes.roles}>
        {MemberRoleCards}
        {OtherRoleCards}
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

export default connect(mapStateToProps, mapDispatchToProps)(FortuneTeller);
