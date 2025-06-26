import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Table, TableHead, TableRow, TableCell,
    TableBody, Paper, Button, TextField, Select, MenuItem,
    InputLabel, FormControl, Box
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useSnackbar } from '../../Context/SnackbarContext ';
import { useTranslation } from 'react-i18next';
const ViewVersions = () => {
    const { articleId } = useParams();
    const [versions, setVersions] = useState([]);
    const [statusFilter, setStatusFilter] = useState('All');
    const [languageFilter, setLanguageFilter] = useState('All');
    const [titleSearch, setTitleSearch] = useState('');
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const isUrdu = i18n.language === 'ur';
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
                <Typography variant="h4">{t('articleVersions')}</Typography>
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
                    {t('back')}
                </Button>
            </Box>

            {/* Filters */}
            <Box display="flex" gap={2} mb={3} flexWrap="wrap">
                <FormControl sx={{ minWidth: 180 }}>
                    <InputLabel>{t('status')}</InputLabel>
                    <Select
                        value={statusFilter}
                        label={t('status')}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <MenuItem value="All">{t('all')}</MenuItem>
                        <MenuItem value="Draft">{t('draft')}</MenuItem>
                        <MenuItem value="Submitted">{t('submitted')}</MenuItem>
                        <MenuItem value="Approved">{t('approved')}</MenuItem>
                        <MenuItem value="Rejected">{t('rejected')}</MenuItem>
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 180 }}>
                    <InputLabel>{t('language')}</InputLabel>
                    <Select
                        value={languageFilter}
                        label={t('language')}
                        onChange={(e) => setLanguageFilter(e.target.value)}
                    >
                        <MenuItem value="All">{t('all')}</MenuItem>
                        <MenuItem value="en">{t('english')}</MenuItem>
                        <MenuItem value="ur">{t('urdu')}</MenuItem>
                        <MenuItem value="fr">{t('french')}</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label={t('searchByTitle')}
                    value={titleSearch}
                    onChange={(e) => setTitleSearch(e.target.value)}
                    sx={{ minWidth: 240 }}
                    inputProps={{ dir: isUrdu ? 'rtl' : 'ltr' }}
                />
            </Box>

            <Paper elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('version')}</TableCell>
                            <TableCell>{t('title')}</TableCell>
                            <TableCell>{t('language')}</TableCell>
                            <TableCell>{t('status')}</TableCell>
                            <TableCell>{t('createdAt')}</TableCell>
                            <TableCell>{t('actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredVersions.map(version => (
                            <TableRow key={version.versionId}>
                                <TableCell>{version.versionNumber}</TableCell>
                                <TableCell>{version.title}</TableCell>
                                <TableCell>{version.language}</TableCell>
                                <TableCell>{t(version.status.toLowerCase())}</TableCell>
                                <TableCell>{new Date(version.createdAt).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        sx={{ ml: 1 }}
                                        onClick={() =>
                                            navigate(`/articles/${articleId}/version/${version.language}/${version.versionNumber}`)
                                        }
                                    >
                                        {t('view')}
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
                                                {t('edit')}
                                            </Button>

                                            <Button
                                                variant="outlined"
                                                color="error"
                                                sx={{ ml: 1 }}
                                                disabled={version.status !== "Draft"}
                                                onClick={() => handleDelete(version)}
                                            >
                                                {t('delete')}
                                            </Button>

                                            <Button
                                                variant="contained"
                                                sx={{ ml: 1 }}
                                                disabled={version.status !== "Draft"}
                                                onClick={() => handleSubmitToEditor(version.versionNumber)}
                                            >
                                                {t('submit')}
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
