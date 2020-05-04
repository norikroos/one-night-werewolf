import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'© '}
      {new Date().getFullYear()}{' '}
      <Link color="inherit" href="/">
        N.K
      </Link>
    </Typography>
  );
};

export default Copyright;
