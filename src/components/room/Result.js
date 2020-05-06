import React, { useState, useEffect } from 'react';
import GavelIcon from '@material-ui/icons/Gavel';
import { makeStyles } from '@material-ui/core/styles';
import { teal, pink } from '@material-ui/core/colors';
import {
  Avatar,
  Box,
  CircularProgress,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core';
import LoadingButton from '../common/LoadingButton';
import LoadingBox from '../common/LoadingBox';

import { connect } from 'react-redux';
import { fetchResult } from '../../store/actions/roomActions';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    touchAction: 'manipulation',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  marginTop: {
    marginTop: theme.spacing(3),
  },
  box: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  roles: {
    padding: theme.spacing(1, 0, 3, 0),
    textAlign: 'center',
  },
  roleCard: {
    width: '15%',
    maxWidth: '100%',
  },
  textWerewolf: {
    backgroundColor: pink[900],
    textAlign: 'center',
  },
  werewolf: {
    backgroundColor: pink[900],
  },
  textVillager: {
    backgroundColor: teal[500],
    textAlign: 'center',
  },
  villager: {
    backgroundColor: teal[500],
  },
  listText: {
    marginLeft: theme.spacing(2),
  },
  grey: {
    color: theme.palette.grey[400],
  },
}));

const Result = props => {
  const {
    uid,
    roomId,
    joinUsers,
    roles,
    loading,
    actionDatas,
    fetchResult,
    resetGame,
    resetting,
  } = props;

  const classes = useStyles();

  useEffect(() => {
    fetchResult(roomId);
  }, [Object.keys(actionDatas).join(',')]);

  const villagerTeamRoles = Object.keys(roles).filter(
    r => roles[r].team === 'villager'
  );
  const werewolfTeamRoles = Object.keys(roles).filter(
    r => roles[r].team === 'werewolf'
  );
  const villagerTeamUsers = Object.keys(actionDatas).filter(userId =>
    villagerTeamRoles.includes(actionDatas[userId].afterRole)
  );
  const werewolfTeamUsers = Object.keys(actionDatas).filter(userId =>
    werewolfTeamRoles.includes(actionDatas[userId].afterRole)
  );

  const userResults = {};
  Object.keys(actionDatas).forEach(votedUserId => {
    userResults[votedUserId] = {
      ...actionDatas[votedUserId],
      votedFrom: Object.keys(actionDatas).filter(
        voteUserId => actionDatas[voteUserId].voteUserId === votedUserId
      ),
    };
  });

  const maxVotedCount = Math.max(
    ...Object.values(userResults).map(data => data.votedFrom?.length)
  );

  // 勝利チーム(最大得票の人の中に人狼チームが入っているかどうかで判断)
  const getWinTeam = () => {
    // 最大得票数のチームのリスト
    const maxVotedTeams = Object.values(userResults)
      .filter(data => data.votedFrom.length === maxVotedCount)
      .map(data => roles[data.afterRole]?.team);

    if (maxVotedTeams.includes('hangedman')) return 'hangedman';
    if (
      maxVotedTeams.includes('werewolf') ||
      (villagerTeamUsers.length === Object.keys(joinUsers).length &&
        maxVotedCount === 1)
    ) {
      return 'villager';
    }

    return 'werewolf';
  };

  const RoleTeamList = ({ teamUsers }) => {
    return (
      <List dense={false}>
        {teamUsers.map(userId => (
          <UserListItem userId={userId} />
        ))}
      </List>
    );
  };

  const UserListItem = ({ userId }) => {
    const user = joinUsers[userId];
    const userResult = userResults[userId];
    const votedFrom = userResult.votedFrom.map(
      voteUserId => joinUsers[voteUserId].name
    );
    return (
      <ListItem key={userId}>
        <img
          src={`${process.env.PUBLIC_URL}/cards/${userResult.afterRole}.png`}
          className={classes.roleCard}
          alt={userId}
        />
        <div className={classes.listText}>
          <Typography variant="body1">
            {user.name}{' '}
            <Typography variant="caption" color="error">
              {votedFrom.length === maxVotedCount ? '処刑' : ''}
            </Typography>
          </Typography>
          <Typography className={classes.grey} variant="caption">
            {'役職: ' +
              roles[userResult.beforeRole].nameJp +
              (userResult.beforeRole !== userResult.afterRole
                ? ' → ' + roles[userResult.afterRole].nameJp
                : '')}
          </Typography>
          <br />
          <Typography className={classes.grey} variant="caption">
            {`得票数: ${votedFrom.length} ` +
              (votedFrom.length > 0 ? `← ${votedFrom.join(', ')}` : '')}
          </Typography>
        </div>
      </ListItem>
    );
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box className={classes.paper}>
        <Avatar className={classes.avatar}>
          <GavelIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          結果
        </Typography>
        {!loading ? (
          <Box className={classes.box} textAlign="center">
            <Typography variant="body1">
              {`${roles[getWinTeam()].nameJp}チームの勝利！`}
            </Typography>
            <Box className={classes.box}>
              <Box className={classes.textWerewolf}>
                <Typography variant="h6">人狼チーム</Typography>
              </Box>
              <Divider className={classes.werewolf} />
              <div>
                <RoleTeamList teamUsers={werewolfTeamUsers} />
              </div>
              <Box className={classes.textVillager}>
                <Typography variant="h6">村人チーム</Typography>
              </Box>
              <Divider className={classes.villager} />
              <div>
                <RoleTeamList teamUsers={villagerTeamUsers} />
              </div>
            </Box>
          </Box>
        ) : (
          <LoadingBox />
        )}
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          disabled={resetting}
          text={`ゲーム設定に戻る`}
          isLoading={resetting}
          onClick={() => resetGame(roomId)}
          loadingColor="primary"
        />
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
    fetchResult: roomId => dispatch(fetchResult(roomId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Result);
