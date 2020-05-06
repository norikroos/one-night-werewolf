import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Copyright from './components/layout/Copyright';
import { Box, CssBaseline } from '@material-ui/core';
import theme from './styles/theme';
import Navbar from './components/layout/Navbar';
import Auth from './components/auth/Auth';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Room from './components/room/Room';
import Home from './components/Home';

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
        <Navbar />
        <Switch>
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <Auth>
            <Switch>
              <Route path="/room/:id" component={Room} />
              <Route path="/" component={Home} />
            </Switch>
          </Auth>
        </Switch>
        <Box mt={5}>
          <Copyright />
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
