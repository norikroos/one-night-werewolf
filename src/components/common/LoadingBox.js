import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  loadingBox: {
    height: '50vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const LoadingBox = () => {
  const classes = useStyles();
  return (
    <Box className={classes.loadingBox}>
      <CircularProgress />
    </Box>
  );
};

export default LoadingBox;
