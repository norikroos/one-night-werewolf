import React from 'react';
import { Grid, Button } from '@material-ui/core';

import { connect } from 'react-redux';
import { signOut } from '../../store/actions/authActions';

const SignOutLink = props => {
  return (
    <Grid container justify="flex-end">
      <Button color="primary" onClick={() => props.signOut()}>
        Sign Out
      </Button>
    </Grid>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    signOut: () => dispatch(signOut()),
  };
};

export default connect(null, mapDispatchToProps)(SignOutLink);
