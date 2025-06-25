import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Paper, Table, TableHead, TableRow, TableCell,
    TableBody, Button, Box
} from '@mui/material';
import axios from '../../api/axios';
import { useSnackbar } from '../SnackbarContext ';
import { useNavigate } from 'react-router-dom';

const PendingReview = () => {
    const [pendingVersions, setPendingVersions] = useState([]);
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPending = async () => {
            try {
                const res = await axios.get('/articles/versions/pending');
                setPendingVersions(res.data);
            } catch (err) {
                console.error(err);
                showSnackbar('Failed to load pending reviews', 'error');
            }
        };
        fetchPending();
    }, []);

    const handleAction = async (articleId, versionNumber, action) => {
        try {
            await axios.post(`/articles/${articleId}/versions/${versionNumber}/review/${action}`);

            showSnackbar(`Version ${action === 'approve' ? 'approved' : 'rejected'} successfully`, 'success');
            setPendingVersions(prev => prev.filter(v => !(v.articleId === articleId && v.versionNumber === versionNumber)));
        } catch (err) {
            console.error(err);
            showSnackbar('Action failed', 'error');
        }
    };

    return (
        <Container>
            <Box mt={4} mb={2}>
                <Typography variant="h4">Pending Article Reviews</Typography>
            </Box>

            <Paper elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Article Title</TableCell>
                            <TableCell>Language</TableCell>
                            <TableCell>Version</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pendingVersions.map(version => (
                            <TableRow key={version.versionId}>
                                <TableCell>{version.title}</TableCell>
                                <TableCell>{version.language}</TableCell>
                                <TableCell>{version.versionNumber}</TableCell>
                                <TableCell>{version.authorUsername}</TableCell>
                                <TableCell>{new Date(version.createdAt).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        sx={{ mr: 1 }}
                                        onClick={() =>
                                            navigate(`/editor/review/article/${version.articleId}/version/${version.versionNumber}`)
                                        }
                                    >
                                        View
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        sx={{ mr: 1 }}
                                        onClick={() => handleAction(version.articleId, version.versionNumber, 'approve')}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleAction(version.articleId, version.versionNumber, 'reject')}
                                    >
                                        Reject
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
};

export default PendingReview;
