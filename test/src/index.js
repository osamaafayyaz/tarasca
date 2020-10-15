import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';


import CssBaseline from '@material-ui/core/CssBaseline';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';

const tarascaTheme = createMuiTheme({
    palette: {
      primary:{
        main: '#333333'
      },
      type: 'dark',
    },
  });


ReactDOM.render(
    <MuiThemeProvider theme={tarascaTheme}>
      <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
        <CssBaseline/>
        <Router>
            <App />
        </Router>
      </SnackbarProvider>
    </MuiThemeProvider>
    ,document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
