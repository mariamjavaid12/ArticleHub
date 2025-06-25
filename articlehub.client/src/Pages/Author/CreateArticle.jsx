import React, { useState } from 'react';
import {
    Container, TextField, Button, Typography, Box,
    MenuItem, Select, InputLabel, FormControl, Card, CardContent, Divider
} from '@mui/material';
import axios from '../../api/axios';
import { useSnackbar } from '../SnackbarContext ';
import { useNavigate } from 'react-router-dom';

const urduFont = {
    fontFamily: "'Noto Nastaliq Urdu', serif",
    direction: 'rtl',
    textAlign: 'right'
};

const CreateArticle = () => {
    const [form, setForm] = useState({
        title: '',
        abstract: '',
        body: '',
        language: 'en'
    });

    const isUrdu = form.language === 'ur';
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/articles', form);
            showSnackbar('Article submitted successfully!', 'success');
            navigate('/author');
        } catch (err) {
            showSnackbar('Submission failed. Please try again.', 'error');
            console.error(err);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            {/* Urdu font stylesheet */}
            {isUrdu && (
                <link
                    href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu&display=swap"
                    rel="stylesheet"
                />
            )}

            <Card elevation={4}>
                <CardContent>
                    <Typography variant="h4" fontWeight={600} gutterBottom>
                        Add New Article
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        Start a new draft by filling out the fields below.
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            name="title"
                            label="Title"
                            margin="normal"
                            value={form.title}
                            onChange={handleChange}
                            required
                            inputProps={{ dir: isUrdu ? 'rtl' : 'ltr' }}
                            sx={isUrdu ? urduFont : {}}
                        />
                        <TextField
                            fullWidth
                            name="abstract"
                            label="Abstract"
                            margin="normal"
                            value={form.abstract}
                            onChange={handleChange}
                            required
                            inputProps={{ dir: isUrdu ? 'rtl' : 'ltr' }}
                            sx={isUrdu ? urduFont : {}}
                        />
                        <TextField
                            fullWidth
                            name="body"
                            label="Body"
                            multiline
                            rows={6}
                            margin="normal"
                            value={form.body}
                            onChange={handleChange}
                            required
                            inputProps={{ dir: isUrdu ? 'rtl' : 'ltr' }}
                            sx={isUrdu ? urduFont : {}}
                        />

                        <FormControl fullWidth margin="normal" required>
                            <InputLabel id="language-label">Language</InputLabel>
                            <Select
                                labelId="language-label"
                                name="language"
                                value={form.language}
                                onChange={handleChange}
                            >
                                <MenuItem value="en">English</MenuItem>
                                <MenuItem value="ur">Urdu</MenuItem>
                                <MenuItem value="fr">French</MenuItem>
                            </Select>
                        </FormControl>

                        <Box textAlign="right">
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                size="large"
                                sx={{ mt: 3 }}
                            >
                                Submit Article
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default CreateArticle;














