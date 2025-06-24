import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import {
    Container, Box, TextField, Button, Typography, MenuItem
} from '@mui/material';
import { Link } from 'react-router-dom';

const Register = () => {
    const [form, setForm] = useState({ username: '', password: '', role: 'Author' });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

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
                        label="Username"
                        value={form.username}
                        onChange={e => setForm({ ...form, username: e.target.value })}
                        error={!!errors.username}
                        helperText={errors.username}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        type="password"
                        label="Password"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        select
                        label="Role"
                        value={form.role}
                        onChange={e => setForm({ ...form, role: e.target.value })}
                    >
                        <MenuItem value="Author">Author</MenuItem>
                        <MenuItem value="Editor">Editor</MenuItem>
                    </TextField>
                    <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                        Register
                    </Button>

                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
                            Login
                        </Link>
                    </Typography>
                </form>
            </Box>
        </Container>
    );
};

export default Register;
