import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Paper, Table, TableHead, TableRow, TableCell,
    TableBody, Button, Box
} from '@mui/material';
import axios from '../../api/axios';
import { useSnackbar } from '../../Context/SnackbarContext ';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
const PendingReview = () => {
    const [pendingVersions, setPendingVersions] = useState([]);
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { t } = useTranslation();
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
    }, [showSnackbar]);

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
                <Typography variant="h4">{t('pendingArticleReviews')}</Typography>
            </Box>

            <Paper elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('articleTitle')}</TableCell>
                            <TableCell>{t('language')}</TableCell>
                            <TableCell>{t('version')}</TableCell>
                            <TableCell>{t('author')}</TableCell>
                            <TableCell>{t('createdAt')}</TableCell>
                            <TableCell>{t('actions')}</TableCell>
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
                                        {t('view')}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        sx={{ mr: 1 }}
                                        onClick={() => handleAction(version.articleId, version.versionNumber, 'approve')}
                                    >
                                        {t('approve')}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleAction(version.articleId, version.versionNumber, 'reject')}
                                    >
                                        {t('reject')}
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
