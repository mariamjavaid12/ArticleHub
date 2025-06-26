import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Paper, Table, TableHead,
    TableRow, TableCell, TableBody, Box, FormControl,
    InputLabel, Select, MenuItem, Button
} from '@mui/material';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
const ReviewedByMe = () => {
    const [reviewed, setReviewed] = useState([]);
    const [filter, setFilter] = useState('All');
    const navigate = useNavigate();
    const { t } = useTranslation();
    useEffect(() => {
        const fetchReviewed = async () => {
            try {
                const res = await axios.get('/articles/versions/reviewed-by-me');
                setReviewed(res.data);
            } catch (err) {
                console.error('Failed to fetch reviewed articles:', err);
            }
        };
        fetchReviewed();
    }, []);

    const filteredReviewed = reviewed.filter((item) =>
        filter === 'All' ? true : item.status === filter
    );

    return (
        <Container>
            <Typography variant="h4" mt={4} mb={2}>
                {t('reviewedByMe')}
            </Typography>

            <Box mb={3} width={200}>
                <FormControl fullWidth>
                    <InputLabel>{t('status')}</InputLabel>
                    <Select
                        value={filter}
                        label={t('status')}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <MenuItem value="All">{t('all')}</MenuItem>
                        <MenuItem value="Approved">{t('approved')}</MenuItem>
                        <MenuItem value="Rejected">{t('rejected')}</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Paper elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('articleId')}</TableCell>
                            <TableCell>{t('title')}</TableCell>
                            <TableCell>{t('language')}</TableCell>
                            <TableCell>{t('version')}</TableCell>
                            <TableCell>{t('status')}</TableCell>
                            <TableCell>{t('author')}</TableCell>
                            <TableCell>{t('reviewedAt')}</TableCell>
                            <TableCell>{t('actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredReviewed.length > 0 ? (
                            filteredReviewed.map((r) => (
                                <TableRow key={`${r.articleId}-${r.versionNumber}`}>
                                    <TableCell>{r.articleId}</TableCell>
                                    <TableCell>{r.title}</TableCell>
                                    <TableCell>{r.language}</TableCell>
                                    <TableCell>{r.versionNumber}</TableCell>
                                    <TableCell>{t(r.status.toLowerCase())}</TableCell>
                                    <TableCell>{r.authorUsername}</TableCell>
                                    <TableCell>
                                        {new Date(r.reviewedAt).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() =>
                                                navigate(
                                                    `/editor/review/article/${r.articleId}/version/${r.versionNumber}`
                                                )
                                            }
                                        >
                                            {t('view')}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                        {t('noReviewedFound')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
};

export default ReviewedByMe;
