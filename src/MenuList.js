import { menuItems } from './data/menu.js';

const MenuList = ({ query }) => {
  const q = (query || '').trim().toLowerCase();
  const items = menuItems.filter((item) =>
    (item.title + ' ' + item.description).toLowerCase().includes(q)
  );

  return (
    <>
      <section aria-label="menu introduction" className="specials-intro">
        <h2>This week's specials!</h2>
      </section>
      <section aria-label="menu items" className="special-item">
        {items.length > 0 ? (
          items.map((item) => (
            <article key={item.id} aria-label={item.title}>
              <figcaption aria-label={item.title + ' image'}>
                <img src={item.image} alt={item.title} />
              </figcaption>
              <div className="special-item-header">
                <h4>{item.title}</h4>
                <h4 className="color-salmon">{item.price}</h4>
              </div>
              <p>{item.description}</p>
              <a href="#order-online" className="special-item-delivery">
                Order a delivery
              </a>
            </article>
          ))
        ) : (
          <p className="menu-empty">No dishes match “{query}”. Try another search.</p>
        )}
      </section>
    </>
  );
};

export default MenuList;
