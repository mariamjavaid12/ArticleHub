import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './auth/AuthContext';
import { SnackbarProvider } from './Context/SnackbarContext ';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <SnackbarProvider>
                    <App />
                </SnackbarProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);