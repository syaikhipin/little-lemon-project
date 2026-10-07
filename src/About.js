const about = {
    title: 'Little Lemon',
    subtitle: 'Chicago',
    description: <>Little Lemon Chicago is a family owned Mediterranean restaurant located in the heart of the city. The restaurant is run by brothers Mario and Adrian, who have always had a passion for cooking and serving delicious food. Growing up in a Mediterranean household, the brothers were exposed to traditional recipes from an early age, and they decided to bring those recipes to the masses with a modern twist. At Little Lemon, you can expect to find a menu full of classic dishes with a creative twist that makes them stand out from the rest. Whether you're looking for a quick lunch or a leisurely dinner, Little Lemon Chicago is the perfect place to indulge in a delicious meal in a cozy and welcoming atmosphere.</>,
    image1: './about-1.jpg',
    image2: './about-2.jpg'
}

const About = () => {
  return (
    <>
    <section aria-label='about' className='about' id='about'>
        <article aria-label='about copy'>
            <h2>{about.title}</h2>
            <h3>{about.subtitle}</h3>
            <p>{about.description}</p>
        </article>
        <span>
        <figcaption aria-label='about image'>
          <img src={about.image1} alt={about.title} />
        </figcaption>
        <figcaption aria-label='about image'>
          <img src={about.image2} alt={about.title} />
        </figcaption>
        </span>
    </section>
    </>
  );
}

export default About;