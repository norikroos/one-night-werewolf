import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import LoadingButton from '../common/LoadingButton';

import { connect } from 'react-redux';
import { signIn } from '../../store/actions/authActions';
import { Redirect } from 'react-router-dom';
import { isLoaded } from 'react-redux-firebase';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
    margin: theme.spacing(3, 0, 2),
  },
  input: {
    '&:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 30px white inset !important',
    },
    '&:-webkit-autofill:hover': {
      WebkitBoxShadow: '0 0 0 30px white inset !important',
    },
    '&:-webkit-autofill:focus': {
      WebkitBoxShadow: '0 0 0 30px white inset !important',
    },
    '&:-webkit-autofill:active': {
      WebkitBoxShadow: '0 0 0 30px white inset !important',
    },
  },
}));

const SignIn = props => {
  const { authError, auth, loading } = props;
  const classes = useStyles();

  const [state, setState] = useState({
    email: '',
    password: '',
  });

  if (auth.uid) return <Redirect to="/" />;

  const handleChange = event => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    props.signIn(state);
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <Typography color="error">{authError}</Typography>
          <TextField
            variant="filled"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={handleChange}
          />
          <TextField
            variant="filled"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            className={classes.submit}
            text="ログイン"
            isLoading={loading}
          />
          <Grid container>
            <Grid item xs>
              <Link href="/reset" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

const mapStateProps = state => {
  console.log(state);
  return {
    authError: state.auth.authError,
    auth: state.firebase.auth,
    loading: state.auth.loading,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signIn: credentials => dispatch(signIn(credentials)),
  };
};

export default connect(mapStateProps, mapDispatchToProps)(SignIn);
