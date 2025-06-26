import React, { useEffect, useState } from 'react';
import {
    Container, Typography, TextField, Button, Box
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useSnackbar } from '../../Context/SnackbarContext ';

const EditArticle = () => {
    const { id } = useParams(); // Article ID
    const [form, setForm] = useState({
        title: '',
        abstract: '',
        body: '',
        language: 'en'
    });
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchLatestVersion = async () => {
            try {
                const res = await axios.get(`/articles/${id}/versions`);
                const latest = res.data?.[0];
                if (latest) {
                    setForm({
                        title: latest.title,
                        abstract: latest.abstract,
                        body: latest.body,
                        language: latest.language
                    });
                }
            } catch (err) {
                console.error("Error loading article version", err);
                showSnackbar("Failed to load article", "error");
            }
        };

        fetchLatestVersion();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/articles/${id}/versions`, form);
            showSnackbar("Article updated successfully!", "success");
            navigate(`/articles/${id}/versions`);
        } catch (err) {
            if (err.response && err.response.status === 400 && err.response.data === "No changes detected. Article was not updated.") {
                showSnackbar("No changes detected. Version not created.", "info");
            } else {
                console.error("Error updating article", err);
                showSnackbar("Update failed", "error");
            }
        }
    };

    return (
        <Container maxWidth="md">
            <Box mt={4}>
                <Typography variant="h4" gutterBottom>
                    Edit Article
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        margin="normal"
                        value={form.title}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        label="Abstract"
                        name="abstract"
                        margin="normal"
                        value={form.abstract}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        label="Body"
                        name="body"
                        multiline
                        rows={6}
                        margin="normal"
                        value={form.body}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        label="Language"
                        name="language"
                        margin="normal"
                        value={form.language}
                        onChange={handleChange}
                        disabled // prevent editing language when editing
                    />
                    <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                        Save Changes
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default EditArticle;
