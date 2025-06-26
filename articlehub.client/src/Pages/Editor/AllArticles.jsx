import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Paper, Table, TableHead,
    TableRow, TableCell, TableBody, Button, Chip
} from '@mui/material';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AllArticles = () => {
    const [articles, setArticles] = useState([]);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const isUrdu = i18n.language === 'ur';
    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const res = await axios.get('/articles');
            setArticles(res.data);
        } catch (err) {
            console.error('Failed to fetch articles:', err);
        }
    };

    const urduFont = {
        fontFamily: 'Noto Nastaliq Urdu, serif',
        direction: 'rtl'
    };

    return (
        <Container maxWidth="lg" sx={isUrdu ? urduFont : {}}>
            <Typography variant="h4" mt={4} mb={3}>
                {t('allArticles')}
            </Typography>

            <Paper elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('articleId')}</TableCell>
                            <TableCell>{t('title')}</TableCell>
                            <TableCell>{t('language')}</TableCell>
                            <TableCell>{t('versionCount')}</TableCell>
                            <TableCell>{t('createdAt')}</TableCell>
                            <TableCell>{t('actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {articles.length > 0 ? articles.map(article => {
                            const versions = article.versions || [];
                            const latest = versions.length > 0
                                ? [...versions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
                                : null;

                            const createdAt = latest?.createdAt
                                ? new Date(latest.createdAt).toLocaleString()
                                : t('notAvailable');

                            return (
                                <TableRow key={article.id}>
                                    <TableCell>{article.id}</TableCell>
                                    <TableCell>{latest?.title || t('untitled')}</TableCell>
                                    <TableCell>{latest?.language || t('notAvailable')}</TableCell>
                                    <TableCell>{versions.length}</TableCell>
                                    <TableCell>
                                        <span dir="ltr" style={{ fontFamily: 'monospace' }}>{createdAt}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            onClick={() => navigate(`/articles/${article.id}/versions`)}
                                        >
                                            {t('viewVersions')}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        }) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    {t('noArticles')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
};
export default AllArticles;
