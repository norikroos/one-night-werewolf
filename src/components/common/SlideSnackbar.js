import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Snackbar, Slide } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles(theme => ({}));

const SlideSnackbar = props => {
  const classes = useStyles();

  const {
    direction = 'up',
    autoHideDuration = 2000,
    message,
    open = false,
    handleClose,
    severity = 'success',
    color = 'info',
  } = props;

  const [state, setState] = useState({
    Transition: function Transition(transProps) {
      return <Slide {...transProps} direction={direction} />;
    },
  });

  return (
    <Snackbar
      TransitionComponent={state.Transition}
      // anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      onClose={(event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        handleClose(event, reason);
      }}
      open={open}
      autoHideDuration={autoHideDuration}
    >
      <Alert severity={severity} color={color}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SlideSnackbar;
