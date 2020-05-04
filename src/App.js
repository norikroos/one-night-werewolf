import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import Copyright from './components/layout/Copyright';
import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from './styles/theme';

function App() {
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // const theme = React.useMemo(
  //   () =>
  //     createMuiTheme({
  //       palette: {
  //         type: prefersDarkMode ? 'dark' : 'light',
  //       },
  //     }),
  //   [prefersDarkMode]
  // );

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Helmet
          title="One Night Werewolf Online"
          meta={[
            {
              name: 'viewport',
              content: 'width=device-width, initial-scale=1, user-scalable=no',
            },
          ]}
        />
        <Switch></Switch>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
