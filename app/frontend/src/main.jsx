// Add debugging statements to see if context providers are working properly

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './services/authProvider';
import { ApiProvider } from './services/apiService';

// Uncomment for debugging
// console.log('React Version:', React.version);
// console.log('Starting application...');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      {/* Uncomment for debugging
      {(props) => {
        console.log('AuthProvider rendered');
        return <ApiProvider>{props.children}</ApiProvider>;
      }} */}
      <ApiProvider>
        <App />
      </ApiProvider>
    </AuthProvider>
  </React.StrictMode>
);