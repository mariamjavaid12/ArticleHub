import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import PrivateRoute from './auth/PrivateRoute';
import AuthorDashboard from './Pages/AuthorDashboard';
import EditorDashboard from './Pages/EditorDashboard';
import DashboardLayout from './layout/DashboardLayout';
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
                        <DashboardLayout>
                            <AuthorDashboard />
                        </DashboardLayout>
                    </PrivateRoute>
                }
            />
            <Route
                path="/editor"
                element={
                    <PrivateRoute roles={['Editor']}>
                        <DashboardLayout>
                            <EditorDashboard />
                        </DashboardLayout>
                    </PrivateRoute>
                }
            />

            <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
    );
};

export default App;