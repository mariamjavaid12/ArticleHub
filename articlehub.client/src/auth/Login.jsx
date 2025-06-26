import React, { useState } from 'react';
import {
    Container, Box, TextField, Button,
    Typography, Link, Stack, FormControlLabel, Checkbox
} from '@mui/material';
import axios from '../api/axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation  } from 'react-i18next';

const Login = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [rememberMe, setRememberMe] = useState(true);
    const [loginError, setLoginError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
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

            const lang = res.data.languagePreference || 'en';
            i18n.changeLanguage(lang);
            localStorage.setItem('i18nextLng', lang);

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
                        label={t('username')}
                        value={form.username}
                        onChange={e => setForm({ ...form, username: e.target.value })}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        type="password"
                        label={t('password')}
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                    />

                    <FormControlLabel
                        control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
                        label={t('rememberMe')}
                    />

                    {loginError && (
                        <Typography color="error" variant="body2" mt={1}>
                            {t(loginError)} {/* Or show directly if it's a message string */}
                        </Typography>
                    )}

                    <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                        {t('login')}
                    </Button>

                    <Typography variant="body2" textAlign="center" mt={2}>
                        {t('noAccount')}{" "}
                        <Link onClick={() => navigate('/register')} sx={{ cursor: 'pointer' }}>
                            {t('signup')}
                        </Link>
                    </Typography>
                </form>

            </Box>
        </Container>
    );
};

export default Login;
