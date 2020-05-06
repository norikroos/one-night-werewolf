import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

const Auth = props =>
  props.auth.uid ? (
    props.children
  ) : (
    <Redirect to={`/signin?redirectFrom=${props.location.pathname}`} />
  );

const mapStateProps = state => {
  // console.log(state);
  return {
    auth: state.firebase.auth,
  };
};

export default connect(mapStateProps)(Auth);
