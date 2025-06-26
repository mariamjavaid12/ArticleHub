import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Box, CircularProgress, Button, Paper, Divider
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';
const ViewArticle = () => {
    const { articleId, language, versionNumber } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const isUrdu = i18n.language === 'ur';
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await axios.get(`/articles/${articleId}/versions/${language}/${versionNumber}`);
                setArticle(res.data);
            } catch (err) {
                console.error("Error fetching article", err);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [articleId, language, versionNumber]);

    if (loading) {
        return <Box sx={{ mt: 4, textAlign: 'center' }}><CircularProgress /></Box>;
    }

    if (!article) {
        return <Typography variant="h6" mt={4}>Article not found.</Typography>;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                    sx={{ flexDirection: isUrdu ? 'row-reverse' : 'row' }}
                >
                    <Typography
                        variant="h4"
                        fontWeight={600}
                        sx={{ fontFamily: isUrdu ? 'Noto Nastaliq Urdu' : 'inherit', direction: isUrdu ? 'rtl' : 'ltr' }}
                    >
                        {article.title}
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(`/articles/${articleId}/versions`)}
                    >
                        {t('back')}
                    </Button>
                </Box>

                <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    mb={2}
                    sx={{
                        direction: isUrdu ? 'rtl' : 'ltr',
                        fontFamily: isUrdu ? 'Noto Nastaliq Urdu' : 'inherit'
                    }}
                >
                    {t('language')}: <strong><span dir="ltr" style={{ fontFamily: 'monospace' }}>{article.language}</span></strong> &nbsp;|&nbsp;
                    {t('version')}: <strong><span dir="ltr" style={{ fontFamily: 'monospace' }}>{article.versionNumber}</span></strong> &nbsp;|&nbsp;
                    {t('createdAt')}: <strong><span dir="ltr" style={{ fontFamily: 'monospace' }}>{new Date(article.createdAt).toLocaleString()}</span></strong>
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{ direction: isUrdu ? 'rtl' : 'ltr', fontFamily: isUrdu ? 'Noto Nastaliq Urdu' : 'inherit' }}
                >
                    <strong>{t('abstract')}:</strong> {article.abstract}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{ direction: isUrdu ? 'rtl' : 'ltr', fontFamily: isUrdu ? 'Noto Nastaliq Urdu' : 'inherit' }}
                >
                    <strong>{t('body')}:</strong>
                </Typography>

                <Typography
                    variant="body1"
                    paragraph
                    sx={{
                        whiteSpace: 'pre-line',
                        direction: isUrdu ? 'rtl' : 'ltr',
                        fontFamily: isUrdu ? 'Noto Nastaliq Urdu' : 'inherit'
                    }}
                >
                    {article.body}
                </Typography>
            </Paper>
        </Container>
    );
};

export default ViewArticle;
