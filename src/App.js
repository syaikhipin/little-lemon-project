import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import './App.css';

export const STORAGE_KEY = 'littlelemon_user';

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function App() {
  const [user, setUser] = useState(loadUser);

  const saveUser = (u) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } catch {
      /* storage unavailable — keep in-memory session only */
    }
    setUser(u);
  };

  const logout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setUser(null);
  };

  return (
    <BrowserRouter basename="/little-lemon-project/app">
      <Header user={user} />
      <Main user={user} saveUser={saveUser} logout={logout} />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
