import React from 'react';
import {
    Box, Typography, Container, Grid, Card, CardContent
} from '@mui/material';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ArticleIcon from '@mui/icons-material/Article';
import HistoryIcon from '@mui/icons-material/History';
import LanguageIcon from '@mui/icons-material/Language';
import HomeIcon from '@mui/icons-material/Home';
import { useTranslation } from 'react-i18next';
const EditorDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const cards = [
        {
            title: t('pendingReviews'),
            description: t('pendingReviewsDesc'),
            icon: <PendingActionsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
            path: '/editor/pending'
        },
        {
            title: t('allArticles'),
            description: t('allArticlesDesc'),
            icon: <ArticleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
            path: '/editor/articles'
        },
        {
            title: t('reviewedArticles'),
            description: t('reviewedArticlesDesc'),
            icon: <HistoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
            path: '/editor/reviewed-by-me'
        }
    ];

    return (
        <Container maxWidth="lg">
            <Box mt={4} mb={4}>
                <Typography variant="h4" fontWeight={600}>
                    {t('welcome')}, {user?.username || t('editor')}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" mt={1}>
                    {t('editorDashboardSubtitle')}
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {cards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                            sx={{ p: 2, cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
                            onClick={() => navigate(card.path)}
                        >
                            <CardContent>
                                {card.icon}
                                <Typography variant="h6" mt={2}>
                                    {card.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {card.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default EditorDashboard;
