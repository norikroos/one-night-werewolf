import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { Avatar, Grid, Link } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { Redirect } from 'react-router-dom';

import { connect } from 'react-redux';
import { signOut } from '../../store/actions/authActions';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  link: {
    color: theme.palette.text.primary,
    textDecoration: 'none',
    '&:focus, &:hover, &:visited, &:link, &:active': {
      textDecoration: 'none',
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

const Navbar = props => {
  const classes = useStyles();
  const { auth, signOut } = props;

  const AuthButton = () => {
    if (auth.uid) {
      return (
        <Button color="primary" onClick={() => signOut()}>
          ログアウト
        </Button>
      );
    }
    if (document.location.pathname === '/signin') {
      return (
        <Button color="primary" href={`signup${document.location.search}`}>
          ユーザー登録
        </Button>
      );
    }
    return (
      <Button color="primary" href={`signin${document.location.search}`}>
        ログイン
      </Button>
    );
  };

  return (
    <div className={classes.root}>
      <AppBar elevation={1} position="static" color="transparent">
        <Toolbar>
          {/* <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton> */}
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            onClick={() => <Redirect to="/" />}
          >
            <Link href="/" className={classes.link}>
              <Avatar
                alt="werewolf"
                src={`${process.env.PUBLIC_URL}/favicon.ico`}
                className={classes.small}
              />
            </Link>
          </IconButton>
          <Typography variant="body2" className={classes.title}>
            <Link href="/" className={classes.link}>
              ワンナイト人狼オンライン
            </Link>
          </Typography>
          <AuthButton />
        </Toolbar>
      </AppBar>
    </div>
  );
};

const mapStateToProps = state => {
  console.log(state);
  return {
    auth: state.firebase.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signOut: () => dispatch(signOut()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
