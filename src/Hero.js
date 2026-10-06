const hero = {
  title: 'Little Lemon',
  subtitle: 'Chicago',
  description: 'We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.',
  image: './restauranfood.jpg'
};

const Hero = ({ query, onQueryChange }) => {
  return (
    <header>
      <article aria-label="hero copy">
        <h1>{hero.title}</h1>
        <h3>{hero.subtitle}</h3>
        <p>{hero.description}</p>
        <div className="search-bar" role="search">
          <input
            type="search"
            id="menu-search"
            aria-label="Search the menu"
            placeholder="Search the menu…"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
        </div>
      </article>
      <figcaption aria-label="hero image">
        <img src={hero.image} alt={hero.title} />
      </figcaption>
    </header>
  );
};

export default Hero;
