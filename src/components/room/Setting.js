import React, { useState, useEffect } from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import SettingsIcon from '@material-ui/icons/Settings';
import { makeStyles } from '@material-ui/core/styles';
import { blue, pink } from '@material-ui/core/colors';
import {
  Avatar,
  Box,
  CircularProgress,
  Container,
  Grid,
  Input,
  InputLabel,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core';
import LoadingButton from '../common/LoadingButton';
import SlideSnackbar from '../common/SlideSnackbar';

import { connect } from 'react-redux';
import {
  fetchJoinUsers,
  listenJoinUsersUpdate,
  addUseRole,
  removeUseRole,
  adjustVillagerCount,
  startGame,
} from '../../store/actions/roomActions';

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
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(0),
  },
  box: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  loadingBox: {
    marginTop: theme.spacing(2),
    textAlign: 'center',
  },
  account: {
    color: theme.palette.primary.light,
  },
  roles: {
    padding: theme.spacing(1, 0, 3, 0),
  },
  roleCard: {
    maxWidth: '100%',
  },
  addIcon: {
    color: blue[200],
  },
  removeIcon: {
    color: pink[200],
  },

  disabled: {
    color: theme.palette.grey[600],
  },
}));

const Setting = props => {
  const {
    uid,
    roomId,
    createdBy,
    selectedRoles,
    joinUsers,
    roles,
    fetchJoinUsers,
    listenJoinUsersUpdate,
    adjustVillagerCount,
    addUseRole,
    removeUseRole,
    fetchingUsers,
    starting,
    startGame,
  } = props;

  useEffect(() => {
    adjustVillagerCount();
  }, [selectedRoles.join(','), Object.keys(joinUsers).join(',')]);

  useEffect(() => {
    listenJoinUsersUpdate(roomId);
  }, [Object.keys(joinUsers).join(',')]);

  const classes = useStyles();

  const [state, setState] = useState({
    open: false,
  });

  const isActiveAddButton = roleKey => {
    const selectedRoleCount = selectedRoles.filter(r => r === roleKey).length;
    const selectedRole = roles[roleKey];
    const villagerCount = selectedRoles.filter(r => r === 'villager').length;
    const villagerRole = roles['villager'];
    if (
      selectedRoleCount < selectedRole.max &&
      villagerCount > villagerRole.min
    ) {
      if (
        // 人間サイドが最低一つ残るように
        villagerCount === villagerRole.min + 1 &&
        selectedRole.team !== villagerRole.team
      ) {
        return false;
      }
      return true;
    }
    return false;
  };

  const isActiveRemoveButton = roleKey => {
    const selectedRoleCount = selectedRoles.filter(r => r === roleKey).length;
    if (selectedRoleCount > roles[roleKey].min) {
      return true;
    }
    return false;
  };

  const handleClick = () => {
    const target = document.querySelector(`input[value="${roomId}"`);
    // e.target.select();
    target.select();
    document.execCommand('copy');
    setState({
      open: true,
    });
  };

  const handleClose = (event, reason) => {
    setState({ ...state, open: false });
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <SettingsIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          ゲーム設定
        </Typography>
        <Box className={classes.box}>
          <Typography variant="body2">
            <InputLabel shrink>ルームID</InputLabel>
            <Input
              value={roomId}
              fullWidth
              readOnly={true}
              endAdornment={
                <InputAdornment
                  onClick={e => e.preventDefault()}
                  position="end"
                >
                  <FileCopyIcon />
                </InputAdornment>
              }
              onClick={handleClick}
              // onChange={e => {
              //   e.target.value = roomId;
              //   e.target.dispatchEvent(
              //     new KeyboardEvent('keydown', { key: 'Enter' })
              //   );
              // }}
            />
            <SlideSnackbar
              handleClose={handleClose}
              open={state.open}
              message="クリップボードにコピーしました"
            />
          </Typography>
        </Box>
        <Box className={classes.box}>
          <Typography variant="h6">
            参加者 ({Object.keys(joinUsers).length}人)
          </Typography>

          {fetchingUsers ? (
            <Box className={classes.loadingBox}>
              <CircularProgress size={35} thickness={6} color={'primary'} />
            </Box>
          ) : (
            <List>
              {Object.keys(joinUsers).map(id => {
                return (
                  <ListItem dense key={id}>
                    <ListItemIcon>
                      <AccountCircleIcon className={classes.account} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        joinUsers[id].name +
                        (id === createdBy ? '　(管理者)' : '')
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </Box>
        <Box className={classes.box}>
          <Typography variant="h6">役職を選択</Typography>
          <Grid container spacing={2} className={classes.roles}>
            {roles &&
              Object.keys(roles).map(roleKey => {
                const canRemove =
                  isActiveRemoveButton(roleKey) && uid === createdBy;
                const canAdd = isActiveAddButton(roleKey) && uid === createdBy;
                return (
                  <Grid item xs={3}>
                    <img
                      src={`${process.env.PUBLIC_URL}/cards/${roleKey}.png`}
                      className={classes.roleCard}
                      alt={roleKey}
                    />
                    <Grid container justify="space-around" spacing={1}>
                      {roleKey !== 'villager' && (
                        <RemoveCircleIcon
                          className={
                            canRemove ? classes.removeIcon : classes.disabled
                          }
                          onClick={() => canRemove && removeUseRole(roleKey)}
                        />
                      )}
                      <Typography>
                        {selectedRoles.filter(r => r === roleKey).length}
                      </Typography>
                      {roleKey !== 'villager' && (
                        <AddCircleIcon
                          className={
                            canAdd ? classes.addIcon : classes.disabled
                          }
                          onClick={() => canAdd && addUseRole(roleKey)}
                        />
                      )}
                    </Grid>
                  </Grid>
                );
              })}
          </Grid>
        </Box>
        <Box className={classes.box}>
          {Object.keys(joinUsers).length < 3 && (
            <Typography variant="body2">3人以上で開始できます</Typography>
          )}
          {uid !== createdBy && (
            <Typography variant="body2">
              ルーム管理者のみ操作できます
            </Typography>
          )}
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.submit}
            disabled={
              starting || Object.keys(joinUsers).length < 3 || uid !== createdBy
            }
            text="ゲーム開始"
            isLoading={starting}
            onClick={() =>
              Object.keys(joinUsers).length >= 3 &&
              uid === createdBy &&
              startGame(roomId, selectedRoles)
            }
            loadingColor="secondary"
          />
        </Box>
      </div>
    </Container>
  );
};

const mapStateToProps = state => {
  return {
    fetchingUsers: state.room.fetchingUsers,
    starting: state.room.starting,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchJoinUsers: roomId => dispatch(fetchJoinUsers(roomId)),
    listenJoinUsersUpdate: roomId => dispatch(listenJoinUsersUpdate(roomId)),
    addUseRole: role => dispatch(addUseRole(role)),
    removeUseRole: role => dispatch(removeUseRole(role)),
    adjustVillagerCount: () => dispatch(adjustVillagerCount()),
    startGame: (roomId, selectedRoles) =>
      dispatch(startGame(roomId, selectedRoles)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Setting);
