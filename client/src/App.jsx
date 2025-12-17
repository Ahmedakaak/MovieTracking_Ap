import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, fetchIpAndLocation } from './store/slices/authSlice';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Watchlists from './pages/Watchlists';
import Search from './pages/Search';
import Details from './pages/Details';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchIpAndLocation());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <div className="min-h-screen text-white animated-gradient">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<div className="container mx-auto px-4 py-8"><Login /></div>} />
          <Route path="/register" element={<div className="container mx-auto px-4 py-8"><Register /></div>} />
          <Route path="/search" element={<div className="container mx-auto px-4 py-8"><Search /></div>} />
          <Route path="/media/:type/:id" element={<div className="container mx-auto px-4 py-8"><Details /></div>} />
          <Route
            path="/watchlists"
            element={
              <ProtectedRoute>
                <div className="container mx-auto px-4 py-8"><Watchlists /></div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
