import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home.js';
import Booking from './Booking.js';

const Main = () => {
  return (
    <BrowserRouter basename="/little-lemon-project">
      <Routes>
        <Route
        path='/' 
        element={<Home />}
        >
        </Route>
        <Route 
        path='/booking' 
        element={<Booking />}
        >
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


export default Main;
