import React, { useState } from 'react';
import {
    Container, Box, TextField, Button,
    Typography, Link, Stack, FormControlLabel, Checkbox
} from '@mui/material';
import axios from '../api/axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [rememberMe, setRememberMe] = useState(true);
    const [loginError, setLoginError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');

        try {
            const res = await axios.post('/auth/login', form, {
                validateStatus: () => true  // <== This prevents Axios from throwing on 401
            });

            if (res.status === 401) {
                setLoginError(res.data || 'Invalid username or password');
                return;
            }

            const token = res?.data?.token;
            if (!token) {
                setLoginError('Invalid response from server');
                return;
            }

            if (rememberMe) {
                localStorage.setItem('token', token);
            } else {
                sessionStorage.setItem('token', token);
            }

            login(token, res.data.username, res.data.role);
        } catch (err) {
            console.error("Unexpected login error:", err);
            setLoginError('Something went wrong. Please try again.');
        }
    };
        
    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, p: 4, border: '1px solid #ccc', borderRadius: 2 }}>
                <Typography variant="h5" mb={3} textAlign="center">Login</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Username"
                        value={form.username}
                        onChange={e => setForm({ ...form, username: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        type="password"
                        label="Password"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                    />

                    <FormControlLabel
                        control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
                        label="Remember me"
                    />

                    {loginError && (
                        <Typography color="error" variant="body2" mt={1}>
                            {loginError}
                        </Typography>
                    )}

                    <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                        Login
                    </Button>

                    <Typography variant="body2" textAlign="center" mt={2}>
                        Don't have an account?{" "}
                        <Link onClick={() => navigate('/register')} sx={{ cursor: 'pointer' }}>
                            Sign up
                        </Link>
                    </Typography>
                </form>
            </Box>
        </Container>
    );
};

export default Login;
