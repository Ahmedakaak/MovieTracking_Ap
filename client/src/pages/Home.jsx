import { useEffect, useState } from 'react';
import api from '../utils/api';
import MovieCard from '../components/MovieCard';
import { useSelector, useDispatch } from 'react-redux';
import { getWatchlists, addItem } from '../store/slices/watchlistSlice';
import { Link } from 'react-router-dom';
import {
    Play,
    TrendingUp,
    Star,
    ChevronRight,
    Sparkles,
    Film,
    Tv,
    Search
} from 'lucide-react';

const Home = () => {
    const [trending, setTrending] = useState([]);
    const [featured, setFeatured] = useState(null);
    const [loading, setLoading] = useState(true);
    const { watchlists } = useSelector(state => state.watchlists);
    const { isAuthenticated } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const res = await api.get('/tmdb/trending/all/week');
                const results = res.data.results;
                setTrending(results);
                // Pick a random featured movie from top 5
                if (results.length > 0) {
                    const randomIndex = Math.floor(Math.random() * Math.min(5, results.length));
                    setFeatured(results[randomIndex]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrending();
        if (isAuthenticated) {
            dispatch(getWatchlists());
        }
    }, [isAuthenticated, dispatch]);

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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="text-center">
                    <div className="spinner mx-auto mb-4"></div>
                    <p className="text-gray-400 text-lg">Loading amazing content...</p>
                </div>
            </div>
        );
    }

    const backdropUrl = featured?.backdrop_path
        ? `https://image.tmdb.org/t/p/original${featured.backdrop_path}`
        : null;

    return (
        <div className="space-y-16 -mt-8 -mx-4">
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center overflow-hidden">
                {/* Backdrop Image */}
                {backdropUrl && (
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${backdropUrl})` }}
                    >
                        <div className="hero-gradient absolute inset-0"></div>
                    </div>
                )}

                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl float"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl float" style={{ animationDelay: '-3s' }}></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl float" style={{ animationDelay: '-1.5s' }}></div>
                </div>

                {/* Hero Content */}
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl fade-in">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 badge mb-6">
                            <Sparkles className="w-4 h-4 text-indigo-400" />
                            <span className="text-indigo-300">Trending Now</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                            <span className="gradient-text">Track, Discover</span>
                            <br />
                            <span className="text-white">& Watch</span>
                        </h1>

                        {/* Description */}
                        <p className="text-xl text-gray-300 mb-8 max-w-xl leading-relaxed">
                            Your personal movie & TV show tracker. Create watchlists,
                            discover trending content, and never miss what's next.
                        </p>

                        {/* Featured Movie Info */}
                        {featured && (
                            <div className="glass rounded-2xl p-6 mb-8 max-w-lg fade-in delay-200">
                                <div className="flex items-start gap-4">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w200${featured.poster_path}`}
                                        alt={featured.title || featured.name}
                                        className="w-20 h-28 object-cover rounded-lg shadow-lg"
                                    />
                                    <div className="flex-1">
                                        <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                                            Featured
                                        </span>
                                        <h3 className="text-xl font-bold text-white mt-1">
                                            {featured.title || featured.name}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="flex items-center gap-1 star-rating">
                                                <Star className="w-4 h-4 fill-current" />
                                                <span className="text-sm font-semibold">{featured.vote_average?.toFixed(1)}</span>
                                            </div>
                                            <span className="text-gray-400 text-sm">
                                                {new Date(featured.release_date || featured.first_air_date).getFullYear()}
                                            </span>
                                            <span className="badge text-xs">
                                                {featured.media_type === 'tv' ? 'TV Show' : 'Movie'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4 fade-in delay-300">
                            <Link
                                to="/search"
                                className="btn-primary inline-flex items-center gap-2"
                            >
                                <Search className="w-5 h-5" />
                                Start Exploring
                            </Link>
                            {featured && (
                                <Link
                                    to={`/media/${featured.media_type || 'movie'}/${featured.id}`}
                                    className="btn-secondary inline-flex items-center gap-2"
                                >
                                    <Play className="w-5 h-5" />
                                    View Details
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
                        <div className="w-1 h-2 bg-white/50 rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: Film, label: 'Movies', value: '500K+', color: 'from-indigo-500 to-purple-500' },
                        { icon: Tv, label: 'TV Shows', value: '100K+', color: 'from-purple-500 to-pink-500' },
                        { icon: TrendingUp, label: 'Daily Updates', value: '24/7', color: 'from-pink-500 to-rose-500' },
                        { icon: Star, label: 'User Rating', value: '4.9', color: 'from-amber-500 to-orange-500' },
                    ].map((stat, index) => (
                        <div
                            key={stat.label}
                            className="glass rounded-2xl p-6 text-center card-hover fade-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                            <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Trending Section */}
            <section className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="section-title flex items-center gap-3">
                            <TrendingUp className="w-8 h-8 text-indigo-500" />
                            Trending This Week
                        </h2>
                        <p className="text-gray-400 mt-2">
                            Discover what everyone's watching right now
                        </p>
                    </div>
                    <Link
                        to="/search"
                        className="hidden md:flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition font-semibold"
                    >
                        View All
                        <ChevronRight className="w-5 h-5" />
                    </Link>
                </div>

                {/* Movie Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {trending.slice(0, 10).map((movie, index) => (
                        <div
                            key={movie.id}
                            className="fade-in"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <MovieCard movie={movie} onAdd={handleAdd} />
                        </div>
                    ))}
                </div>

                {/* Show More (Mobile) */}
                {trending.length > 10 && (
                    <div className="mt-8 text-center md:hidden">
                        <Link
                            to="/search"
                            className="btn-secondary inline-flex items-center gap-2"
                        >
                            View All Trending
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                )}
            </section>

            {/* More Trending Section */}
            {trending.length > 10 && (
                <section className="container mx-auto px-4 pb-8">
                    <div className="mb-8">
                        <h2 className="section-title">More to Explore</h2>
                        <p className="text-gray-400 mt-2">
                            Keep scrolling for more amazing content
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {trending.slice(10, 20).map((movie, index) => (
                            <div
                                key={movie.id}
                                className="fade-in"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <MovieCard movie={movie} onAdd={handleAdd} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Call to Action Section */}
            <section className="container mx-auto px-4 pb-16">
                <div className="relative overflow-hidden rounded-3xl glass-dark p-12 text-center">
                    {/* Background decoration */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to start tracking?
                        </h2>
                        <p className="text-gray-400 text-lg mb-8">
                            Create your free account and build your ultimate watchlist today.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            {!isAuthenticated ? (
                                <>
                                    <Link to="/register" className="btn-primary">
                                        Get Started Free
                                    </Link>
                                    <Link to="/login" className="btn-secondary">
                                        Sign In
                                    </Link>
                                </>
                            ) : (
                                <Link to="/watchlists" className="btn-primary inline-flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    Go to My Watchlists
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
