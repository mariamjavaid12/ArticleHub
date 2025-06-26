import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import {
    Container, Box, TextField, Button, Typography, MenuItem
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Register = () => {
    const [form, setForm] = useState({ username: '', password: '', role: 'Author', languagePreference: 'en' });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { t } = useTranslation();
    const validate = () => {
        const newErrors = {};

        if (!form.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (form.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!form.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (form.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await axios.post('/auth/register', form);
            navigate('/login');
        } catch {
            alert('Registration failed');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, p: 4, border: '1px solid #ccc', borderRadius: 2 }}>
                <Typography variant="h5" mb={3} textAlign="center">Register</Typography>
                <form onSubmit={handleSubmit} noValidate>
                    <TextField
                        fullWidth
                        margin="normal"
                        label={t('username')}
                        value={form.username}
                        onChange={e => setForm({ ...form, username: e.target.value })}
                        error={!!errors.username}
                        helperText={errors.username && t(errors.username)}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        type="password"
                        label={t('password')}
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        error={!!errors.password}
                        helperText={errors.password && t(errors.password)}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        select
                        label={t('role')}
                        value={form.role}
                        onChange={e => setForm({ ...form, role: e.target.value })}
                    >
                        <MenuItem value="Author">{t('author')}</MenuItem>
                        <MenuItem value="Editor">{t('editor')}</MenuItem>
                    </TextField>
                    <TextField
                        fullWidth
                        margin="normal"
                        select
                        label={t('language')}
                        value={form.languagePreference}
                        onChange={e => setForm({ ...form, languagePreference: e.target.value })}
                    >
                        <MenuItem value="en">{t('english')}</MenuItem>
                        <MenuItem value="ur">{t('urdu')}</MenuItem>
                    </TextField>
                    <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                        {t('register')}
                    </Button>

                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        {t('alreadyAccount')}{" "}
                        <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
                            {t('login')}
                        </Link>
                    </Typography>
                </form>
            </Box>
        </Container>
    );
};

export default Register;
