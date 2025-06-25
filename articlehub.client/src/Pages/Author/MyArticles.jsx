import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Table, TableHead, TableRow, TableCell,
    TableBody, Paper, Button, Select, MenuItem, FormControl, InputLabel,
    Box, TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

const MyArticles = () => {
    const [articles, setArticles] = useState([]);
    const [languageFilter, setLanguageFilter] = useState('All');
    const [titleSearch, setTitleSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await axios.get('/articles');

                const sorted = res.data.sort((a, b) => {
                    const aDate = new Date(a.versions[0]?.createdAt || 0);
                    const bDate = new Date(b.versions[0]?.createdAt || 0);
                    return bDate - aDate;
                });

                setArticles(sorted);
            } catch (err) {
                console.error("Failed to fetch articles", err);
            }
        };
        fetchArticles();
    }, []);

    const filteredArticles = articles.filter(article => {
        const latest = article.versions[0];
        const matchesLanguage =
            languageFilter === 'All' || latest?.language === languageFilter;
        const matchesTitle =
            latest?.title?.toLowerCase().includes(titleSearch.toLowerCase());

        return matchesLanguage && matchesTitle;
    });

    return (
        <Container>
            <Typography variant="h4" gutterBottom mt={4}>
                My Articles
            </Typography>

            {/* Filters */}
            <Box display="flex" gap={2} mb={2} flexWrap="wrap">
                <FormControl sx={{ minWidth: 180 }}>
                    <InputLabel>Language</InputLabel>
                    <Select
                        value={languageFilter}
                        label="Language"
                        onChange={(e) => setLanguageFilter(e.target.value)}
                    >
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="ur">Urdu</MenuItem>
                        <MenuItem value="fr">French</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label="Search by Title"
                    value={titleSearch}
                    onChange={(e) => setTitleSearch(e.target.value)}
                    sx={{ minWidth: 240 }}
                />
            </Box>

            {/* Table */}
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
                        {filteredArticles.map(article => {
                            const versions = article.versions || [];
                            const latest = versions[0];
                            const oldest = versions[versions.length - 1];
                            const createdAt = oldest?.createdAt
                                ? new Date(oldest.createdAt).toLocaleString()
                                : 'N/A';

                            return (
                                <TableRow key={article.id}>
                                    <TableCell>{article.id}</TableCell>
                                    <TableCell>{latest?.title}</TableCell>
                                    <TableCell>{latest?.language}</TableCell>
                                    <TableCell>{versions.length}</TableCell>
                                    <TableCell>{createdAt}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            onClick={() =>
                                                navigate(`/articles/${article.id}/versions`)
                                            }
                                        >
                                            View Versions
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
};

export default MyArticles;
