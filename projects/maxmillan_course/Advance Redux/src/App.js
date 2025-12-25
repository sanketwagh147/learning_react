import { useEffect } from 'react';
import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartData, sendCartData } from './store/cart-actions';

import { Fragment } from 'react/jsx-runtime';
import  Notification  from './components/UI/Notification';

let initial = true;

function App() {
  const cartIsVisible = useSelector((state) => state.ui.isCartVisible);
  const cart = useSelector((state) => state.cart);
  const notification = useSelector((state) => state.ui.notification);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCartData());
  }, [dispatch]);
  
  useEffect(() => {
    
    if (initial) {
      initial = false;
      return;
    }
    if (cart.changed === false) {
      return;
    }

    dispatch(sendCartData(cart));

  }, [cart, dispatch]);
  console.log(cartIsVisible);

  return (
    <Fragment>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout>
        {cartIsVisible && <Cart />}
        <Products />
      </Layout>
    </Fragment>
  );
}

export default App;
