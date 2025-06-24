import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Table, TableHead, TableRow,
    TableCell, TableBody, Button, Paper
} from '@mui/material';
import axios from '../../api/axios';

const EditorDashboard = () => {
    const [pendingArticles, setPendingArticles] = useState([]);

    useEffect(() => {
        fetchPendingArticles();
    }, []);

    const fetchPendingArticles = async () => {
        try {
            const response = await axios.get('/api/editor/pending-submissions');
            setPendingArticles(response.data);
        } catch (err) {
            console.error('Error fetching articles:', err);
        }
    };

    const handleApprove = async (articleId, versionNumber) => {
        try {
            await axios.post(`/api/editor/approve`, { articleId, versionNumber });
            fetchPendingArticles();
        } catch (err) {
            console.error('Approval failed:', err);
        }
    };

    const handleReject = async (articleId, versionNumber) => {
        try {
            await axios.post(`/api/editor/reject`, { articleId, versionNumber });
            fetchPendingArticles();
        } catch (err) {
            console.error('Rejection failed:', err);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom mt={4}>Pending Article Submissions</Typography>
            <Paper elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Language</TableCell>
                            <TableCell>Version</TableCell>
                            <TableCell>Submitted At</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pendingArticles.length > 0 ? pendingArticles.map(article => (
                            <TableRow key={`${article.articleId}-${article.versionNumber}`}>
                                <TableCell>{article.title}</TableCell>
                                <TableCell>{article.authorName}</TableCell>
                                <TableCell>{article.language}</TableCell>
                                <TableCell>{article.versionNumber}</TableCell>
                                <TableCell>{new Date(article.createdAt).toLocaleString()}</TableCell>
                                <TableCell align="center">
                                    <Button variant="outlined" color="success" onClick={() => handleApprove(article.articleId, article.versionNumber)}>
                                        Approve
                                    </Button>
                                    <Button variant="outlined" color="error" onClick={() => handleReject(article.articleId, article.versionNumber)} sx={{ ml: 1 }}>
                                        Reject
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">No pending submissions</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
};

export default EditorDashboard;
