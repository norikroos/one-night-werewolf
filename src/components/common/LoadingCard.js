import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  wrapper: {
    width: '100%',
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  roleImage: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  description: {
    margin: theme.spacing(3, 0),
  },
  roleCard: {
    maxWidth: '100%',
  },
  remainCard: {
    maxWidth: '48%',
  },
  roles: {
    padding: theme.spacing(1, 0, 3, 0),
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
}));

const LoadingCard = ({
  imageName = 'card-back',
  isLoading = false,
  loadingColor = 'primary',
  selected = false,
  selectColor = 'secondary.main',
  disabled = false,
  className,
} = {}) => {
  const classes = useStyles();
  return (
    <Box
      className={classes.wrapper}
      border={selected * 2}
      borderColor={selectColor}
    >
      <img
        src={`${process.env.PUBLIC_URL}/cards/${imageName}.png`}
        className={
          className +
          ' ' +
          classes.roleCard +
          ' ' +
          (disabled && classes.disabled)
        }
      />
      {isLoading && (
        <CircularProgress
          size={24}
          thickness={6}
          className={classes.buttonProgress}
          color={loadingColor}
        />
      )}
    </Box>
  );
};

export default LoadingCard;
