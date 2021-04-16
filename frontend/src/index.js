import React from 'react';
import ReactDOM from 'react-dom';
import App from'./App';
import {LoginProvider} from './LoginContext'


ReactDOM.render(
  <React.StrictMode>
    <LoginProvider>
        <App />
    </LoginProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
