import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Avatar,
  Link,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core';
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
  console.log(props);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const AuthMenuItem = () => {
    if (auth.uid) {
      return (
        <MenuItem
          onClick={() => {
            handleClose();
            signOut();
          }}
        >
          ログアウト
        </MenuItem>
      );
    }
    if (document.location.pathname === '/signin') {
      return (
        <MenuItem
          onClick={() => handleClose(`signup${document.location.search}`)}
        >
          ユーザー登録
        </MenuItem>
      );
    }
    return (
      <MenuItem
        onClick={() => handleClose(`signin${document.location.search}`)}
      >
        ログイン
      </MenuItem>
    );
  };

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = toUrl => {
    setAnchorEl(null);
    if (toUrl) {
      document.location.href = toUrl;
    }
  };

  return (
    <div className={classes.root}>
      <AppBar elevation={1} position="static" color="transparent">
        <Toolbar>
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
          <IconButton
            edge="end"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={() => handleClose()}
          >
            <MenuItem onClick={() => handleClose('/')}>ホーム</MenuItem>
            <AuthMenuItem />
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  );
};

const mapStateToProps = state => {
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
