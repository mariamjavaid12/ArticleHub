import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useAuth } from '../auth/AuthContext';

const EditorDashboard = () => {
    const { user } = useAuth();

    const handleReviewSubmissions = () => {
        // This will eventually link to the review submissions page
        console.log('Navigate to Review Submissions');
    };

    return (
        <Box>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={4}
            >
                <Typography variant="h4">Welcome, {user?.username}</Typography>
            </Box>

            <Box mb={3}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleReviewSubmissions}
                >
                    Review Pending Submissions
                </Button>
            </Box>

            <Typography variant="body1" color="textSecondary">
                Use the sidebar to manage articles, review submissions, and handle versions.
            </Typography>
        </Box>
    );
};

export default EditorDashboard;