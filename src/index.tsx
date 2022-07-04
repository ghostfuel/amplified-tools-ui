import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';

import './theme.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import CognitoProvider from './contexts/CognitoProvider';
import SpotifyProvider from './contexts/SpotifyProvider';
import { COGNITO } from "./config";

Amplify.configure({
  aws_cognito_region: COGNITO.REGION,
  aws_user_pools_id: COGNITO.USER_POOL_ID,
  aws_user_pools_web_client_id: COGNITO.APP_CLIENT_ID,
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <CognitoProvider>
    <SpotifyProvider>
      <App />
    </SpotifyProvider>
  </CognitoProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
