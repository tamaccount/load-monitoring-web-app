import React from 'react';
import ReactDOM from 'react-dom';
import { SnackbarProvider } from 'notistack';

import App from './App';
import SnackbarContent from "./components/Snack";

import './index.css';

ReactDOM.render(
  <SnackbarProvider
    maxSnack={3}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    content={(key, message) =>
      <SnackbarContent id={key} message={message} variant="success" />
    }
  >
    <App />
  </SnackbarProvider>,
  document.getElementById('root')
);

