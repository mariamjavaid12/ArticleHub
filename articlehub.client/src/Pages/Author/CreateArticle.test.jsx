import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateArticle from '../CreateArticle';
import { BrowserRouter } from 'react-router-dom';
import axios from '../../api/axios';
import { SnackbarProvider } from '../../contexts/SnackbarContext';
import '@testing-library/jest-dom';

jest.mock('../../api/axios'); // Mock Axios

const renderWithProviders = (ui) => {
    return render(
        <BrowserRouter>
            <SnackbarProvider>{ui}</SnackbarProvider>
        </BrowserRouter>
    );
};

describe('CreateArticle Component', () => {
    test('renders form inputs', () => {
        renderWithProviders(<CreateArticle />);
        expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Abstract/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Body/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Language/i)).toBeInTheDocument();
    });

    test('submits form successfully', async () => {
        axios.post.mockResolvedValueOnce({}); // Mock success response

        renderWithProviders(<CreateArticle />);
        fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'My Article' } });
        fireEvent.change(screen.getByLabelText(/Abstract/i), { target: { value: 'Short intro' } });
        fireEvent.change(screen.getByLabelText(/Body/i), { target: { value: 'Main content' } });
        fireEvent.change(screen.getByLabelText(/Language/i), { target: { value: 'en' } });

        fireEvent.click(screen.getByRole('button', { name: /submit article/i }));

        await waitFor(() =>
            expect(screen.getByText(/Article submitted successfully!/i)).toBeInTheDocument()
        );
    });

    test('shows error on failed submission', async () => {
        axios.post.mockRejectedValueOnce(new Error('Network Error'));

        renderWithProviders(<CreateArticle />);
        fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Fail Test' } });
        fireEvent.change(screen.getByLabelText(/Abstract/i), { target: { value: 'Intro' } });
        fireEvent.change(screen.getByLabelText(/Body/i), { target: { value: 'Body text' } });
        fireEvent.change(screen.getByLabelText(/Language/i), { target: { value: 'en' } });

        fireEvent.click(screen.getByRole('button', { name: /submit article/i }));

        await waitFor(() =>
            expect(screen.getByText(/Submission failed/i)).toBeInTheDocument()
        );
    });
});
