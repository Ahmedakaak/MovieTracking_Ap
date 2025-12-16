import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../store/slices/watchlistSlice';
import { Star, Calendar, Clock, Plus } from 'lucide-react';

const Details = () => {
    const { type, id } = useParams();
    const [media, setMedia] = useState(null);
    const [loading, setLoading] = useState(true);
    const { watchlists } = useSelector(state => state.watchlists);
    const { isAuthenticated } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await api.get(`/tmdb/${type}/${id}`);
                setMedia(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [type, id]);

    const handleAdd = () => {
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
            tmdbId: media.id,
            mediaType: type,
            title: media.title || media.name,
            posterPath: media.poster_path,
            releaseDate: media.release_date || media.first_air_date,
            voteAverage: media.vote_average
        };

        dispatch(addItem({ id: targetList._id, item: itemData }))
            .unwrap()
            .then(() => alert(`Added to ${targetList.name}`))
            .catch(err => alert(err.msg || 'Error adding to watchlist'));
    };

    if (loading) return <div>Loading...</div>;
    if (!media) return <div>Media not found</div>;

    const backdropUrl = media.backdrop_path
        ? `https://image.tmdb.org/t/p/original${media.backdrop_path}`
        : null;

    const posterUrl = media.poster_path
        ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
        : 'https://via.placeholder.com/500x750';

    return (
        <div className="relative">
            {/* Backdrop */}
            {backdropUrl && (
                <div className="absolute top-0 left-0 w-full h-96 opacity-20 z-0">
                    <img src={backdropUrl} alt="Backdrop" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900"></div>
                </div>
            )}

            <div className="relative z-10 flex flex-col md:flex-row gap-8 pt-10">
                <img src={posterUrl} alt={media.title || media.name} className="w-64 rounded-lg shadow-2xl" />

                <div className="flex-1">
                    <h1 className="text-4xl font-bold mb-2">{media.title || media.name}</h1>
                    <div className="flex items-center space-x-4 text-gray-300 mb-6">
                        <span className="flex items-center"><Star className="w-4 h-4 text-yellow-500 mr-1" /> {media.vote_average?.toFixed(1)}</span>
                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {new Date(media.release_date || media.first_air_date).getFullYear()}</span>
                        {media.runtime && <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {media.runtime} min</span>}
                    </div>

                    <p className="text-lg text-gray-300 mb-8 leading-relaxed">{media.overview}</p>

                    <button
                        onClick={handleAdd}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center transition"
                    >
                        <Plus className="w-5 h-5 mr-2" /> Add to Watchlist
                    </button>

                    <div className="mt-8">
                        <h3 className="text-xl font-bold mb-2">Genres</h3>
                        <div className="flex flex-wrap gap-2">
                            {media.genres?.map(g => (
                                <span key={g.id} className="bg-gray-800 px-3 py-1 rounded-full text-sm">{g.name}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Details;
