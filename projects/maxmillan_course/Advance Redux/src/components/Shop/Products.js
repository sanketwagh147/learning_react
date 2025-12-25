import ProductItem from './ProductItem';
import classes from './Products.module.css';

const DUMMY_PRODUCTS = [
  {
    id: 'p1',
    title: 'kanda',
    price: 6,
    description: 'This are fresh onions!',
  },
  {
    id: 'p2',
    title: 'Lasun',
    price: 5,
    description: 'This is fresh garlic!',
  },
];    

const Products = (props) => {
  return (
    <section className={classes.products}>
      <h2>Buy your favorite products</h2>
      <ul>
        {DUMMY_PRODUCTS.map((product)=><ProductItem
          key={product.id}
          title={product.title}
          id={product.id}
          price={product.price}
          description={product.description} 
        />)}
      </ul>
    </section>
  );
};

export default Products;
