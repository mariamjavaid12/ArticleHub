import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import PrivateRoute from './auth/PrivateRoute';
const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
                path="/author"
                element={
                    <PrivateRoute roles={['Author']}>
                        <div>Author Dashboard</div>
                    </PrivateRoute>
                }
            />
            <Route
                path="/editor"
                element={
                    <PrivateRoute roles={['Editor']}>
                        <div>Editor DashBoard</div>
                    </PrivateRoute>
                }
            />

            <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
    );
};

export default App;