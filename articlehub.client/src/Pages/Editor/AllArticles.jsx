import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Paper, Table, TableHead,
    TableRow, TableCell, TableBody, Button, Chip
} from '@mui/material';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const AllArticles = () => {
    const [articles, setArticles] = useState([]);
    const navigate = useNavigate();

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

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" mt={4} mb={3}>All Articles</Typography>

            <Paper elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Article ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Language</TableCell>
                            <TableCell>Version Count</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {articles.length > 0 ? articles.map(article => {
                            const versions = article.versions;
                            const latest = versions.length > 0
                                ? [...versions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
                                : null;

                            const createdAt = latest?.createdAt
                                ? new Date(latest.createdAt).toLocaleString()
                                : 'N/A';

                            return (
                                <TableRow key={article.id}>
                                    <TableCell>{article.id}</TableCell>
                                    <TableCell>{latest?.title || 'Untitled'}</TableCell>
                                    <TableCell>{latest?.language || 'N/A'}</TableCell>
                                    <TableCell>{versions.length}</TableCell>
                                    <TableCell>{createdAt}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            onClick={() => navigate(`/articles/${article.id}/versions`)}
                                        >
                                            View Versions
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        }) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">No articles found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                </Table>
            </Paper>
        </Container>
    );
};
export default AllArticles;
