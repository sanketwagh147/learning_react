import Header from './components/Header.jsx';
import Shop from './components/Shop.jsx';
import Product from './components/Product.jsx';
import CartContextProvider from './store/shopping-cart-context.jsx';
import { DUMMY_PRODUCTS } from './dummy-products.js';
function App() {
  return (
    <>
      <CartContextProvider>
        {/* <CartContext.Provider>  For older versions of React */}
        <Header
        // cart={shoppingCart}
        // onUpdateCartItemQuantity={handleUpdateCartItemQuantity}
        />
        <Shop>
          {DUMMY_PRODUCTS.map((product) => (
            <li key={product.id}>
              <Product {...product} />
            </li>
          ))}
        </Shop>
      </CartContextProvider>
    </>
  );
}

export default App;
