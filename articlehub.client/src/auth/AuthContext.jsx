import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // ? add this
    const navigate = useNavigate();

    useEffect(() => {
        const storage = localStorage.getItem('token') ? localStorage : sessionStorage;

        const token = storage.getItem('token');
        const username = storage.getItem('username');
        const role = storage.getItem('role');

        if (token && username && role) {
            try {
                const decoded = jwtDecode(token);
                const isExpired = decoded.exp * 1000 < Date.now();

                if (isExpired) {
                    logout(); // Expired? Force logout
                } else {
                    setUser({ token, username, role, ...decoded });

                    const timeUntilExpiry = decoded.exp * 1000 - Date.now();
                    setTimeout(() => {
                        logout();
                    }, timeUntilExpiry);
                }
            } catch {
                localStorage.clear();
                sessionStorage.clear();
            }
        }

        setLoading(false);
    }, []); 

    const login = (token, username, role, remember = true) => {
        const storage = remember ? localStorage : sessionStorage;

        storage.setItem('token', token);
        storage.setItem('username', username);
        storage.setItem('role', role);

        const decoded = jwtDecode(token);
        setUser({ token, username, role, ...decoded });

        navigate(role === 'Author' ? '/author' : '/editor');
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

