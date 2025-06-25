import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Box, CircularProgress, Button, Paper, Divider
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ViewArticle = () => {
    const { articleId, language, versionNumber } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h4" fontWeight={600}>{article.title}</Typography>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(`/articles/${articleId}/versions`)}
                    >
                        Back
                    </Button>
                </Box>

                <Typography variant="subtitle2" color="text.secondary" mb={2}>
                    Language: <strong>{article.language}</strong> &nbsp;|&nbsp;
                    Version: <strong>{article.versionNumber}</strong> &nbsp;|&nbsp;
                    Created At: <strong>{new Date(article.createdAt).toLocaleString()}</strong>
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h7" gutterBottom><b>Abstract:</b> {article.abstract}</Typography>
                {/*<Typography variant="body1" paragraph>{article.abstract}</Typography>*/}

                <Divider sx={{ my: 3 }} />

                <Typography variant="h7" gutterBottom><b>Body: </b></Typography>
                <Typography variant="body1" paragraph whiteSpace="pre-line">
                    {article.body}
                </Typography>
            </Paper>
        </Container>
    );
};

export default ViewArticle;
