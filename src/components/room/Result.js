import React, { useState, useEffect } from 'react';
import GavelIcon from '@material-ui/icons/Gavel';
import { makeStyles } from '@material-ui/core/styles';
import { teal, pink, yellow } from '@material-ui/core/colors';
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
import { toCamelcase } from '../../module/util';

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
  werewolf: {
    backgroundColor: pink[900],
    textAlign: 'center',
  },
  villager: {
    backgroundColor: teal[500],
    textAlign: 'center',
  },
  hangedMan: {
    backgroundColor: yellow[800],
    textAlign: 'center',
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

  const getTeamUsers = team =>
    Object.keys(actionDatas).filter(userId =>
      Object.keys(roles)
        .filter(r => roles[r].team === team)
        .includes(actionDatas[userId].afterRole)
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

  // チームのリスト(重複を削除)
  const teamList = Object.keys(roles)
    .map(roleName => roles[roleName].team)
    .filter((r, i, self) => self.indexOf(r) === i);

  // 最大得票数
  const maxVotedCount = Math.max(
    ...Object.values(userResults).map(data => data.votedFrom?.length)
  );

  // 最大得票数の役職
  const maxVotedRoles = Object.values(userResults)
    .filter(data => data.votedFrom.length === maxVotedCount)
    .map(data => data.afterRole);

  // 勝利チーム(最大得票の人の中に人狼チームが入っているかどうかで判断)
  const judgeWinTeam = () => {
    roles['mad-man'].team = 'werewolf';
    if (maxVotedCount === 1) {
      // 平和村時
      if (maxVotedRoles.includes('werewolf')) return 'werewolf'; // 人狼が含まれている場合
      roles['mad-man'].team = 'villager'; // 狂人のチームを村人側に変更
      return 'villager';
    } else {
      // 平和村以外
      if (maxVotedRoles.includes('hanged-man')) return 'hanged-man'; // 吊人が処刑されている場合
      if (maxVotedRoles.includes('werewolf')) return 'villager'; // 人狼が処刑されている場合
      if (
        !Object.values(userResults)
          .map(data => data.afterRole)
          .includes('werewolf')
      ) {
        // 人狼が役職にない場合
        roles['mad-man'].team = 'villager'; // 狂人のチームを村人側に変更
      }
      return 'werewolf';
    }
  };

  const RoleTeamList = ({ teamUsers }) => {
    return (
      <List dense={false}>
        {teamUsers.map((userId, index) => (
          <UserListItem key={index} userId={userId} />
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
            {user.name}
            <Typography variant="caption" color="error">
              {votedFrom.length === maxVotedCount && maxVotedCount > 1
                ? ' 処刑 '
                : ' '}
            </Typography>
            {roles[userResult.afterRole].team === judgeWinTeam() ? (
              <Typography variant="caption" color="secondary">
                Win
              </Typography>
            ) : (
              <Typography variant="caption" color="primary">
                Rose
              </Typography>
            )}
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
              {`${roles[judgeWinTeam()].nameJp}チームの勝利！`}
            </Typography>
            <Box className={classes.box}>
              {teamList.map((team, index) => {
                return (
                  <div key={index}>
                    <Box className={classes[toCamelcase(team)]}>
                      <Typography variant="h6">
                        {roles[team]?.nameJp}チーム
                      </Typography>
                    </Box>
                    <div>
                      <RoleTeamList teamUsers={getTeamUsers(team)} />
                    </div>
                  </div>
                );
              })}
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
