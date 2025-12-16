import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import React from 'react';

// Mock movie data for testing
const mockMovie = {
    id: 123,
    title: 'Test Movie Title',
    name: null,
    poster_path: '/test-poster.jpg',
    vote_average: 8.5,
    release_date: '2024-01-15',
    first_air_date: null,
    media_type: 'movie'
};

// Mock onAdd function
const mockOnAdd = vi.fn();

// Helper function to render MovieCard with Router context
const renderMovieCard = (movie = mockMovie) => {
    return render(
        <BrowserRouter>
            <MovieCard movie={movie} onAdd={mockOnAdd} />
        </BrowserRouter>
    );
};

describe('MovieCard', () => {
    // Test Case 1: Check if the MovieCard renders the movie title
    it('should render the movie title', () => {
        renderMovieCard();
        const titleElement = screen.getByText('Test Movie Title');
        expect(titleElement).toBeTruthy();
    });

    // Test Case 2: Check if the rating is displayed
    it('should display the movie rating', () => {
        renderMovieCard();
        const ratingElement = screen.getByText('8.5');
        expect(ratingElement).toBeTruthy();
    });

    // Test Case 3: Check if the poster image is rendered with correct alt text
    it('should render the poster image with correct alt text', () => {
        renderMovieCard();
        const imageElement = screen.getByAltText('Test Movie Title');
        expect(imageElement).toBeTruthy();
        expect(imageElement.getAttribute('src')).toBe('https://image.tmdb.org/t/p/w500/test-poster.jpg');
    });

    // Test Case 4: Check if the "Details" button/link exists
    it('should have a Details button', () => {
        renderMovieCard();
        const detailsButton = screen.getByText('Details');
        expect(detailsButton).toBeTruthy();
    });
});
