import { useState } from 'react';
import api from '../utils/api';
import MovieCard from '../components/MovieCard';
import { useSelector, useDispatch } from 'react-redux';
import { addItem } from '../store/slices/watchlistSlice';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const { watchlists } = useSelector(state => state.watchlists);
    const { isAuthenticated } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const res = await api.get('/tmdb/search/multi', {
                params: { query }
            });
            setResults(res.data.results);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (movie) => {
        if (!isAuthenticated) {
            alert('Please login to add to watchlist');
            return;
        }

        if (watchlists.length === 0) {
            alert('Please create a watchlist first!');
            return;
        }

        const targetList = watchlists[0];

        const itemData = {
            tmdbId: movie.id,
            mediaType: movie.media_type || 'movie',
            title: movie.title || movie.name,
            posterPath: movie.poster_path,
            releaseDate: movie.release_date || movie.first_air_date,
            voteAverage: movie.vote_average
        };

        dispatch(addItem({ id: targetList._id, item: itemData }))
            .unwrap()
            .then(() => alert(`Added to ${targetList.name}`))
            .catch(err => alert(err.msg || 'Error adding to watchlist'));
    };

    return (
        <div>
            <div className="mb-8">
                <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
                    <input
                        type="text"
                        placeholder="Search movies & TV shows..."
                        className="flex-1 bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition flex items-center"
                    >
                        <SearchIcon className="w-5 h-5 mr-2" />
                        Search
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="text-center">Searching...</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {results.map(movie => (
                        movie.poster_path && ( // Only show items with posters
                            <MovieCard key={movie.id} movie={movie} onAdd={handleAdd} />
                        )
                    ))}
                </div>
            )}
        </div>
    );
};

export default Search;
