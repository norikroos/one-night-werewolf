import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  wrapper: {
    width: '100%',
    marginTop: theme.spacing(3),
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

const LoadingButton = ({
  type = 'submit',
  fullWidth = true,
  variant = 'contained',
  color = 'primary',
  className,
  disabled = false,
  onClick,
  text = 'click',
  isLoading = false,
  loadingColor = 'primary',
} = {}) => {
  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <Button
        type={type}
        fullWidth={fullWidth}
        variant={variant}
        color={color}
        className={className}
        disabled={disabled}
        onClick={onClick}
      >
        {text}
      </Button>
      {isLoading && (
        <CircularProgress
          size={24}
          thickness={6}
          className={classes.buttonProgress}
          color={loadingColor}
        />
      )}
    </div>
  );
};

export default LoadingButton;
