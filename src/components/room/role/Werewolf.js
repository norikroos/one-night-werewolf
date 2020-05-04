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

const Werewolf = props => {
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
    fetchAssignedRoles(roomId, uid); // 人狼はアクションがないので最初に実行
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
        <Typography variant="h5" color="secondary">
          {roles[actionData.beforeRole].nameJp}
        </Typography>
      </Box>
      <Typography className={classes.description} variant="caption">
        人狼は自分の仲間を確認することができます。仲間と協力して村人を欺きましょう。
        <br />
        ※味方の人狼が怪盗に役職を交換されていても、交換前に人狼だった方の名前が表示されます。
      </Typography>
      <Typography color="secondary" variant="h6">
        仲間の人狼
      </Typography>
      {Object.keys(actionDatas).length === 1 && (
        <Typography>仲間はいません</Typography>
      )}
      <Grid container spacing={2} className={classes.roles}>
        {Object.keys(actionDatas)
          .filter(userId => userId !== uid)
          .map((userId, index) => {
            console.log(userId);
            return (
              <Grid
                item
                xs={3}
                onClick={() => fetchAssignedRoles(roomId, userId)}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/cards/${actionData.beforeRole}.png`}
                  className={classes.roleCard}
                />
                <Typography variant="caption">{`${joinUsers[userId].name}`}</Typography>
              </Grid>
            );
          })}
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

export default connect(mapStateToProps, mapDispatchToProps)(Werewolf);
