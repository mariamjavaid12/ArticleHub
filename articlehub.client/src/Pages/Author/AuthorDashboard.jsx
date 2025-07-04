import React from 'react';
import {
    Box, Button, Typography, Container, Grid, Card, CardContent
} from '@mui/material';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import ArticleIcon from '@mui/icons-material/Description';
import AddCircleIcon from '@mui/icons-material/AddCircleOutline';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useTranslation } from 'react-i18next';
const AuthorDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleNewArticle = () => {
        navigate('/author/new-article');
    };

    const handleMyArticles = () => {
        navigate('/author/articles');
    };
    const { t } = useTranslation();
    return (
        <Container maxWidth="lg">
            <Box mt={4} mb={4}>
                <Typography variant="h4" fontWeight={600}>
                    {t('welcome')}, {user?.username || t('author')}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" mt={1}>
                    {t('startWriting')}
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ p: 2, cursor: 'pointer', '&:hover': { boxShadow: 6 } }} onClick={handleNewArticle}>
                        <CardContent>
                            <AddCircleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                            <Typography variant="h6" mt={2}>
                                {t('addNewArticle')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {t('startDraft')}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ p: 2, cursor: 'pointer', '&:hover': { boxShadow: 6 } }} onClick={handleMyArticles}>
                        <CardContent>
                            <ListAltIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                            <Typography variant="h6" mt={2}>
                                {t('myArticles')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {t('viewManageDrafts')}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AuthorDashboard;
