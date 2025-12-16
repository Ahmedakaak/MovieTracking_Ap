import { Star, Plus, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const MovieCard = ({ movie, onAdd }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null;

    const year = movie.release_date || movie.first_air_date
        ? new Date(movie.release_date || movie.first_air_date).getFullYear()
        : 'N/A';

    const mediaType = movie.media_type === 'tv' ? 'TV' : 'Movie';

    return (
        <div
            className="group relative rounded-2xl overflow-hidden card-hover"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Card Container */}
            <div className="relative aspect-[2/3] bg-gray-800/50 rounded-2xl overflow-hidden">
                {/* Loading Skeleton */}
                {!imageLoaded && posterUrl && (
                    <div className="absolute inset-0 bg-gray-800 shimmer"></div>
                )}

                {/* Poster Image */}
                {posterUrl ? (
                    <img
                        src={posterUrl}
                        alt={movie.title || movie.name}
                        className={`w-full h-full object-cover transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                            } ${isHovered ? 'scale-110' : 'scale-100'}`}
                        onLoad={() => setImageLoaded(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <div className="text-center text-gray-500 p-4">
                            <Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <span className="text-sm">No Image</span>
                        </div>
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-70'
                    }`}></div>

                {/* Rating Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-white">
                        {movie.vote_average?.toFixed(1) || 'N/A'}
                    </span>
                </div>

                {/* Media Type Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/80 backdrop-blur-sm text-white">
                    {mediaType}
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    {/* Title */}
                    <h3 className="text-lg font-bold text-white leading-tight line-clamp-2 mb-1">
                        {movie.title || movie.name}
                    </h3>

                    {/* Year */}
                    <p className="text-sm text-gray-400 mb-3">{year}</p>

                    {/* Action Buttons - Show on hover */}
                    <div className={`flex gap-2 transition-all duration-300 ${isHovered
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-4'
                        }`}>
                        <Link
                            to={`/media/${movie.media_type || 'movie'}/${movie.id}`}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white text-sm font-semibold hover:bg-white/30 transition-colors"
                        >
                            <Play className="w-4 h-4" />
                            Details
                        </Link>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onAdd(movie);
                            }}
                            className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
                            title="Add to Watchlist"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
