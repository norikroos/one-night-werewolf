import React, { useState, useEffect } from 'react';
import AlarmIcon from '@material-ui/icons/Alarm';
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

import { connect } from 'react-redux';
import { finishDiscussion } from '../../store/actions/roomActions';

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
  roleCard: {
    maxWidth: '100%',
  },
}));

const Discussion = props => {
  const { roomId, selectedRoles, loading, finishDiscussion } = props;

  const classes = useStyles();

  const SelectedRoleCards = selectedRoles
    .slice()
    .sort()
    .map((role, index) => {
      return (
        <Grid item xs={3} key={index}>
          <img
            src={`${process.env.PUBLIC_URL}/cards/${role}.png`}
            className={classes.roleCard}
          />
        </Grid>
      );
    });

  return (
    <Container component="main" maxWidth="xs">
      <Box className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AlarmIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          話し合い
        </Typography>
        <Box className={classes.box}>
          <Typography variant="caption">
            恐ろしい夜が終わりました。これから誰を処刑するかを話し合って決めてください。
          </Typography>
        </Box>
        <Box className={classes.box}>
          <Typography variant="caption">
            Hint: 現在、以下の役職がいます。
          </Typography>
          <Grid container spacing={3} className={classes.roles}>
            {SelectedRoleCards}
          </Grid>
        </Box>
        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          color="secondary"
          disabled={loading}
          text={`話し合いを終了する`}
          isLoading={loading}
          onClick={() => finishDiscussion(roomId)}
          loadingColor="secondary"
        />
      </Box>
    </Container>
  );
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    finishDiscussion: roomId => dispatch(finishDiscussion(roomId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Discussion);
