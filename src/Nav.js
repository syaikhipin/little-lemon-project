import { useState } from 'react';
import { Link } from 'react-router-dom';

import logo from './logo.svg';

const MenuLinks = ({ user, idSuffix }) => {
  if (!user) return null;
  const pid = `nav-profile${idSuffix || ''}`;
  return (
    <>
      <li><Link to="/home">Home</Link></li>
      <li><a href="#about">About</a></li>
      <li><Link to="/booking">Reservations</Link></li>
      <li><Link to="/profile" id={pid}>Profile</Link></li>
    </>
  );
};

const Nav = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav>
        <figcaption aria-label="logo">
          <img src={logo} alt="logo" id="#logo" />
        </figcaption>
        {user && (
          <>
            <ul className="menu-desktop">
              <MenuLinks user={user} />
            </ul>
            <button onClick={toggleMenu}>{isOpen ? 'Close' : 'Menu'}</button>
          </>
        )}
      </nav>
      {user && isOpen && (
        <ul className="menu-mobile">
          <MenuLinks user={user} idSuffix="-mobile" />
        </ul>
      )}
    </>
  );
};

export default Nav;
