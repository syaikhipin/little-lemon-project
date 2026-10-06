import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home.js';
import Booking from './Booking.js';
import Onboarding from './Onboarding.js';
import Profile from './Profile.js';

const Main = ({ user, saveUser, logout }) => {
  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/home" replace /> : <Onboarding onComplete={saveUser} />}
      />
      <Route
        path="/home"
        element={user ? <Home /> : <Navigate to="/" replace />}
      />
      <Route
        path="/booking"
        element={user ? <Booking /> : <Navigate to="/" replace />}
      />
      <Route
        path="/profile"
        element={user ? <Profile user={user} onSave={saveUser} onLogout={logout} /> : <Navigate to="/" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Main;
