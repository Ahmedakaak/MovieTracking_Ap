import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getWatchlists, createWatchlist, deleteWatchlist, removeItem } from '../store/slices/watchlistSlice';
import { Trash2, Plus, Eye, Check } from 'lucide-react';

const Watchlists = () => {
    const { watchlists, loading } = useSelector(state => state.watchlists);
    const dispatch = useDispatch();
    const [activeListId, setActiveListId] = useState(null);
    const [newListName, setNewListName] = useState('');

    useEffect(() => {
        dispatch(getWatchlists());
    }, [dispatch]);

    useEffect(() => {
        if (watchlists.length > 0 && !activeListId) {
            setActiveListId(watchlists[0]._id);
        }
    }, [watchlists, activeListId]);

    const handleCreate = (e) => {
        e.preventDefault();
        if (!newListName.trim()) return;
        dispatch(createWatchlist(newListName));
        setNewListName('');
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this watchlist?')) {
            dispatch(deleteWatchlist(id));
            if (activeListId === id) setActiveListId(null);
        }
    };

    const activeList = watchlists.find(w => w._id === activeListId);

    if (loading && watchlists.length === 0) return <div>Loading...</div>;

    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar / List of Watchlists */}
            <div className="w-full md:w-1/4 space-y-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">My Lists</h2>
                    <form onSubmit={handleCreate} className="flex gap-2 mb-4">
                        <input
                            type="text"
                            placeholder="New List Name"
                            className="flex-1 bg-gray-700 text-white p-2 rounded text-sm"
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                        />
                        <button type="submit" className="bg-blue-600 p-2 rounded hover:bg-blue-700">
                            <Plus className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="space-y-2">
                        {watchlists.map(list => (
                            <div
                                key={list._id}
                                onClick={() => setActiveListId(list._id)}
                                className={`p-3 rounded cursor-pointer flex justify-between items-center transition ${activeListId === list._id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                                    }`}
                            >
                                <span className="truncate">{list.name}</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(list._id); }}
                                    className="text-gray-400 hover:text-red-300"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content / Items */}
            <div className="flex-1">
                {activeList ? (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">{activeList.name} <span className="text-gray-400 text-lg">({activeList.items.length} items)</span></h2>

                        {activeList.items.length === 0 ? (
                            <div className="text-gray-400">No items in this list yet. Search for movies to add them!</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {activeList.items.map(item => (
                                    <div key={item._id} className="bg-gray-800 rounded-lg overflow-hidden flex shadow-md">
                                        <img
                                            src={item.posterPath ? `https://image.tmdb.org/t/p/w200${item.posterPath}` : 'https://via.placeholder.com/200x300'}
                                            alt={item.title}
                                            className="w-24 h-36 object-cover"
                                        />
                                        <div className="p-3 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-bold text-sm line-clamp-2">{item.title}</h3>
                                                <div className="text-xs text-gray-400 mt-1">{new Date(item.releaseDate).getFullYear()}</div>
                                            </div>

                                            <div className="flex justify-end space-x-2 mt-2">
                                                <button
                                                    onClick={() => dispatch(removeItem({ id: activeList._id, itemId: item._id }))}
                                                    className="text-red-400 hover:text-red-300 text-xs flex items-center"
                                                >
                                                    <Trash2 className="w-3 h-3 mr-1" /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center text-gray-400 mt-10">Select or create a watchlist to view items.</div>
                )}
            </div>
        </div>
    );
};

export default Watchlists;
