import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import './styles/globals.css';
import './styles/landing.css';

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './app/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
    <BrowserRouter>
        <AuthProvider><App /></AuthProvider>
    </BrowserRouter>
    </React.StrictMode>
);
