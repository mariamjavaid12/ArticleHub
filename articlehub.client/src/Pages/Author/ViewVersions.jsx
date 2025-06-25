import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Table, TableHead, TableRow, TableCell,
    TableBody, Paper, Button, TextField, Select, MenuItem,
    InputLabel, FormControl, Box
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useSnackbar } from '../SnackbarContext ';

const ViewVersions = () => {
    const { articleId } = useParams();
    const [versions, setVersions] = useState([]);
    const [statusFilter, setStatusFilter] = useState('All');
    const [languageFilter, setLanguageFilter] = useState('All');
    const [titleSearch, setTitleSearch] = useState('');
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();

    // Get current role from localStorage
    const role = localStorage.getItem('role');
    useEffect(() => {
        const fetchVersions = async () => {
            try {
                const res = await axios.get(`/articles/${articleId}/versions`);
                const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setVersions(sorted);
            } catch {
                showSnackbar('Failed to load versions', 'error');
            }
        };
        fetchVersions();
    }, [articleId]);

    const handleDelete = async (version) => {
        if (!window.confirm("Are you sure you want to delete this draft version?")) return;

        try {
            await axios.delete(`/articles/${articleId}/version/${version.language}/${version.versionNumber}`);
            showSnackbar("Draft version deleted", "success");
            setVersions(prev => prev.filter(v => v.versionNumber !== version.versionNumber));
        } catch (err) {
            console.error('Delete failed', err);
            showSnackbar("Delete failed. Only draft versions can be deleted.", "error");
        }
    };

    const handleSubmitToEditor = async (versionId) => {
        if (!window.confirm("Are you sure you want to submit this article version?")) return;

        try {
            await axios.post(`/articles/versions/${versionId}/submit`);
            showSnackbar("Submitted to editor successfully!", "success");
            setVersions(prev =>
                prev.map(v =>
                    v.versionNumber === versionId ? { ...v, status: "Submitted" } : v
                )
            );
        } catch (err) {
            console.error("Submit failed", err);
            showSnackbar("Submission failed", "error");
        }
    };

    const filteredVersions = versions.filter(v => {
        const matchStatus = statusFilter === 'All' || v.status === statusFilter;
        const matchLang = languageFilter === 'All' || v.language === languageFilter;
        const matchTitle = v.title.toLowerCase().includes(titleSearch.toLowerCase());
        return matchStatus && matchLang && matchTitle;
    });

    return (
        <Container>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} mb={2}>
                <Typography variant="h4">Article Versions</Typography>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => {
                       
                        if (role === 'Editor') {
                            navigate('/editor/articles');
                        } else if (role === 'Author') {
                            navigate('/author/articles');
                        } 
                    }}
                >
                    Back
                </Button>
            </Box>

            {/* Filters */}
            <Box display="flex" gap={2} mb={3} flexWrap="wrap">
                <FormControl sx={{ minWidth: 180 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={statusFilter}
                        label="Status"
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Draft">Draft</MenuItem>
                        <MenuItem value="Submitted">Submitted</MenuItem>
                        <MenuItem value="Approved">Approved</MenuItem>
                        <MenuItem value="Rejected">Rejected</MenuItem>
                    </Select>
                </FormControl>

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

            <Paper elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Version</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Language</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredVersions.map(version => (
                            <TableRow key={version.versionId}>
                                <TableCell>{version.versionNumber}</TableCell>
                                <TableCell>{version.title}</TableCell>
                                <TableCell>{version.language}</TableCell>
                                <TableCell>{version.status}</TableCell>
                                <TableCell>
                                    {new Date(version.createdAt).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        sx={{ ml: 1 }}
                                        onClick={() =>
                                            navigate(`/articles/${articleId}/version/${version.language}/${version.versionNumber}`)
                                        }
                                    >
                                        View
                                    </Button>

                                    {role !== 'Editor' && (
                                        <>
                                            <Button
                                                variant="outlined"
                                                sx={{ ml: 1 }}
                                                onClick={() =>
                                                    navigate(`/author/articles/${articleId}/edit`)
                                                }
                                            >
                                                Edit
                                            </Button>

                                            <Button
                                                variant="outlined"
                                                color="error"
                                                sx={{ ml: 1 }}
                                                disabled={version.status !== "Draft"}
                                                onClick={() => handleDelete(version)}
                                            >
                                                Delete
                                            </Button>

                                            <Button
                                                variant="contained"
                                                sx={{ ml: 1 }}
                                                disabled={version.status !== "Draft"}
                                                onClick={() => handleSubmitToEditor(version.versionNumber)}
                                            >
                                                Submit
                                            </Button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
};

export default ViewVersions;
