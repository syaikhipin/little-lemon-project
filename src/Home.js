import { useState } from 'react';
import Hero from './Hero.js';
import MenuList from './MenuList.js';
import Testimonials from './Testimonials.js';
import About from './About.js';

const Home = () => {
  const [query, setQuery] = useState('');

  return (
    <main>
      <Hero query={query} onQueryChange={setQuery} />
      <MenuList query={query} />
      <Testimonials />
      <About />
    </main>
  );
};

export default Home;
