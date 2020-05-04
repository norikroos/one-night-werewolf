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

const Villager = props => {
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

  useEffect(() => {
    fetchAssignedRoles(roomId, uid); // 村人はアクションがないので最初に実行
  }, [Object.keys(actionDatas).join(',')]);

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
        村人は何も能力を持ちません。
        <br />
        一般村人であるあなたは能力を発揮することなく夜を過ごしました。
      </Typography>
    </Box>
  );
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Villager);
