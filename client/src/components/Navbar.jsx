import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { Film, LogOut, User, Search, List, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { isAuthenticated, user, ip, location: userLocation } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const navLinkClass = (path) => `
        relative px-4 py-2 rounded-xl font-medium transition-all duration-300
        ${isActive(path)
            ? 'text-white bg-white/10'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }
    `;

    return (
        <nav className="sticky top-0 z-50 glass-dark">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center space-x-3 group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300">
                            <Film className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold">
                            <span className="gradient-text">Movie</span>
                            <span className="text-white">Tracker</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2">
                        <Link to="/" className={navLinkClass('/')}>
                            Home
                        </Link>
                        <Link to="/search" className={navLinkClass('/search')}>
                            <span className="flex items-center gap-2">
                                <Search className="w-4 h-4" />
                                Search
                            </span>
                        </Link>
                        {isAuthenticated && (
                            <Link to="/watchlists" className={navLinkClass('/watchlists')}>
                                <span className="flex items-center gap-2">
                                    <List className="w-4 h-4" />
                                    Watchlists
                                </span>
                            </Link>
                        )}
                    </div>

                    {/* Auth Section */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                {/* Location Info - Only show if data exists */}
                                {(ip || userLocation) && (
                                    <div className="hidden lg:flex flex-col items-end text-xs text-gray-400 mr-2">
                                        {userLocation ? (
                                            <span className="text-indigo-300 font-medium">
                                                {userLocation.region}, {userLocation.country}
                                            </span>
                                        ) : (
                                            <span>Loading Loc...</span>
                                        )}
                                        <span>IP: {ip || '...'}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-300">
                                        {user?.username}
                                    </span>
                                </div>

                                <button
                                    onClick={() => dispatch(logout())}
                                    className="p-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/login"
                                    className="px-5 py-2.5 rounded-xl text-gray-300 hover:text-white font-medium transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-primary text-sm"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-white/10 fade-in">
                        <div className="flex flex-col space-y-2">
                            <Link
                                to="/"
                                className={navLinkClass('/')}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                to="/search"
                                className={navLinkClass('/search')}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="flex items-center gap-2">
                                    <Search className="w-4 h-4" />
                                    Search
                                </span>
                            </Link>
                            {isAuthenticated && (
                                <Link
                                    to="/watchlists"
                                    className={navLinkClass('/watchlists')}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className="flex items-center gap-2">
                                        <List className="w-4 h-4" />
                                        Watchlists
                                    </span>
                                </Link>
                            )}

                            <div className="pt-4 border-t border-white/10 mt-2">
                                {isAuthenticated ? (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                                <User className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-300">
                                                {user?.username}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                dispatch(logout());
                                                setMobileMenuOpen(false);
                                            }}
                                            className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                        >
                                            <LogOut className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col space-y-2">
                                        <Link
                                            to="/login"
                                            className="w-full text-center py-3 rounded-xl text-gray-300 hover:text-white font-medium transition-colors hover:bg-white/5"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="btn-primary w-full text-center"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Get Started
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
