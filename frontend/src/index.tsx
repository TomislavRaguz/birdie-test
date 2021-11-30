import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { StyledEngineProvider } from '@mui/material/styles';
import { CssBaseline, ThemeProvider } from '@mui/material';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { reduxStore } from './redux/store';
import { MUITheme } from './MUITheme';

ReactDOM.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={MUITheme}>
        <BrowserRouter>
          <Provider store={reduxStore}>
            <CssBaseline />
            <App />
          </Provider>
        </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>   
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
