import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Paper, Table, TableHead,
    TableRow, TableCell, TableBody, Box, FormControl,
    InputLabel, Select, MenuItem, Button
} from '@mui/material';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const ReviewedByMe = () => {
    const [reviewed, setReviewed] = useState([]);
    const [filter, setFilter] = useState('All');
    const navigate = useNavigate();

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
            <Typography variant="h4" mt={4} mb={2}>Articles Reviewed By Me</Typography>

            <Box mb={3} width={200}>
                <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={filter}
                        label="Status"
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Approved">Approved</MenuItem>
                        <MenuItem value="Rejected">Rejected</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Paper elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Article ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Language</TableCell>
                            <TableCell>Version</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Reviewed At</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredReviewed.length > 0 ? filteredReviewed.map((r) => (
                            <TableRow key={`${r.articleId}-${r.versionNumber}`}>
                                <TableCell>{r.articleId}</TableCell>
                                <TableCell>{r.title}</TableCell>
                                <TableCell>{r.language}</TableCell>
                                <TableCell>{r.versionNumber}</TableCell>
                                <TableCell>{r.status}</TableCell>
                                <TableCell>{r.authorUsername}</TableCell>
                                <TableCell>{new Date(r.reviewedAt).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() =>
                                            navigate(`/editor/review/article/${r.articleId}/version/${r.versionNumber}`)
                                        }
                                    >
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={8} align="center">No reviewed articles found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
};

export default ReviewedByMe;
