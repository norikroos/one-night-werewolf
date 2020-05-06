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
  box: {
    marginTop: theme.spacing(2),
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
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
    display: 'flex',
    justifyContent: 'center',
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
    actionState,
  } = props;
  const actionData = actionDatas[uid];

  const [state, setState] = useState({
    clickedUser: '',
  });

  // TODO: カード選択時に確認
  const RoleCard = props => {
    const { onClick, cardText = '', imageName = 'card-back' } = props;
    return (
      <Grid item xs={3} onClick={onClick}>
        <LoadingCard
          imageName={imageName}
          isLoading={actionState === 'executing'}
          // selected={actionData.selectUserId === uid}
          // disabled={actionData.selectUserId || actionState === 'executing'}
        />
        <Typography variant="caption">{cardText}</Typography>
      </Grid>
    );
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
        人狼は自分の仲間を確認することができます。仲間と協力して村人を欺きましょう。
        <br />
        ※味方の人狼が怪盗に役職を交換されていても、交換前に人狼だった方の名前が表示されます。
      </Typography>
      <Typography color="secondary" variant="h6">
        仲間の人狼
      </Typography>
      {actionData.selectUserId && Object.keys(actionDatas).length === 1 && (
        <Box className={classes.box}>
          <Typography variant="body2">仲間はいませんでした</Typography>
        </Box>
      )}
      <Grid container spacing={2} className={classes.roles}>
        {Object.keys(actionDatas)
          .filter(userId => userId !== uid)
          .map((userId, index) => {
            return (
              <RoleCard
                key={index}
                cardText={joinUsers[userId].name}
                imageName={actionDatas[userId].beforeRole}
              />
            );
          })}
        {!actionData.selectUserId && (
          <RoleCard
            key="card-back"
            cardText="タップして仲間を確認"
            onClick={() => {
              if (!actionData.selectUserId) {
                setState({ ...state, clickedUser: uid });
                fetchAssignedRoles(roomId, uid);
              }
            }}
          />
        )}
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
