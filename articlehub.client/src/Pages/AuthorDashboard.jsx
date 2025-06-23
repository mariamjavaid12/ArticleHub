import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthorDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleNewArticle = () => {
        navigate('/author/new-article');
    };

    return (
        <Container maxWidth="lg">
            <Box mt={4} mb={3}>
                <Typography variant="h4" fontWeight={600}>
                    Welcome, {user?.username}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" mt={1}>
                    Manage your articles and submissions here.
                </Typography>
            </Box>

            <Box>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleNewArticle}
                >
                    Submit New Article
                </Button>
            </Box>
        </Container>
    );
};

export default AuthorDashboard;