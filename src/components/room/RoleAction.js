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
import {
  fetchJoinUsers,
  finishRoleAction,
  fetchAssignedRoles,
} from '../../store/actions/roomActions';
import LoadingButton from '../common/LoadingButton';
import LoadingBox from '../common/LoadingBox';
import Werewolf from './role/Werewolf';
import FortuneTeller from './role/FortuneTeller';
import PhantomThief from './role/PhantomThief';
import Villager from './role/Villager';

const useStyles = makeStyles(theme => ({}));

const RoleAction = props => {
  const classes = useStyles();
  const {
    uid,
    roomId,
    actionDatas,
    joinUsers,
    finishRoleAction,
    fetchAssignedRoles,
    actionState,
  } = props;
  const actionData = actionDatas[uid];

  useEffect(() => {
    fetchAssignedRoles(roomId);
  }, [Object.keys(actionDatas).join(',')]);

  const RoleComponent = (() => {
    switch (actionData?.beforeRole) {
      case 'werewolf': {
        return <Werewolf {...props} />;
      }
      case 'fortune-teller': {
        return <FortuneTeller {...props} />;
      }
      case 'phantom-thief': {
        return <PhantomThief {...props} />;
      }
      case 'villager': {
        return <Villager {...props} />;
      }
      default: {
        return <div></div>;
      }
    }
  })();

  return (
    <Container component="main" maxWidth="xs">
      {actionData && joinUsers !== {} ? (
        <Box>
          {RoleComponent}
          {actionData.selectUserId && (
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              disabled={actionState === 'finishing' || actionData.finishAction}
              text={
                actionData.finishAction
                  ? '他のユーザーのアクションを待っています'
                  : 'アクションを終了'
              }
              isLoading={actionState === 'finishing'}
              onClick={() => finishRoleAction(roomId)}
              loadingColor="secondary"
            />
          )}
        </Box>
      ) : (
        <LoadingBox />
      )}
    </Container>
  );
};

const mapStateToProps = state => {
  return {
    actionDatas: state.room.actionDatas,
    actionState: state.room.actionState,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    finishRoleAction: roomId => dispatch(finishRoleAction(roomId)),
    fetchAssignedRoles: (roomId, selectUserId) =>
      dispatch(fetchAssignedRoles(roomId, selectUserId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RoleAction);
