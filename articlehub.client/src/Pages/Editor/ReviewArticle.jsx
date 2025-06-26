import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Box, Paper, Button, Divider
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useSnackbar } from '../../Context/SnackbarContext ';
import { useTranslation } from 'react-i18next';
const ReviewArticle = () => {
    //const { versionId } = useParams();
    const [version, setVersion] = useState(null);
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { articleId, versionNumber } = useParams();
    useEffect(() => {
        const fetchVersion = async () => {
            try {
                const res = await axios.get(`/articles/${articleId}/version/${versionNumber}`);
                setVersion(res.data);
            } catch (err) {
                console.error(err);
                showSnackbar('Failed to load article version', 'error');
            }
        };
        fetchVersion();
    }, [articleId, versionNumber, showSnackbar]);

    const handleAction = async (action) => {
        try {
            await axios.post(`/articles/${articleId}/versions/${versionNumber}/review/${action}`);
            showSnackbar(`Version ${action === 'approve' ? 'approved' : 'rejected'} successfully`, 'success');
            navigate('/editor/pending');
        } catch (err) {
            console.error(err);
            showSnackbar('Action failed', 'error');
        }
    };

    if (!version) return null;

    return (
        <Container>
            <Box mt={4} mb={2}>
                <Typography variant="h4">{version.title}</Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    {t('author')}: {version.authorUsername} | {t('language')}: {version.language} | {t('version')}: {version.versionNumber} | {t('createdAt')}: {new Date(version.createdAt).toLocaleString()}
                </Typography>
            </Box>

            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6">{t('abstract')}</Typography>
                <Typography>{version.abstract}</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">{t('body')}</Typography>
                <Typography>{version.body}</Typography>
            </Paper>

            <Box display="flex" gap={2}>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleAction('approve')}
                >
                    {t('approve')}
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleAction('reject')}
                >
                    {t('reject')}
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => navigate('/editor/pending')}
                >
                    {t('backToPending')}
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => navigate('/editor/reviewed-by-me')}
                >
                    {t('backToReviewed')}
                </Button>
            </Box>
        </Container>
    );
};

export default ReviewArticle;
