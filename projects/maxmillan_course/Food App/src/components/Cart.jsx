import { useContext } from 'react';
import Modal from './UI/Modal';
import CartContext from '../store/CartContext';
import { currencyFormatter } from '../util/formatting.js';
import Button from './UI/Button';
import UserProgressContext from '../store/UserProgressContext.jsx';
import CartItem from './CartItem.jsx';

function Cart() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);
  const cartTotal = cartCtx.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const formattedTotal = currencyFormatter.format(cartTotal);

  function closeCartHandler() {
    if (userProgressCtx.progress === 'cart') {
      userProgressCtx.hideCart();
    }
  }

  function checkoutHandler() {
    userProgressCtx.showCheckout();
  }
  return (
    <Modal
      className="cart"
      open={userProgressCtx.progress === 'cart'}
      onClose={closeCartHandler}
    >
      <h2> Your Shopping Cart </h2>
      <ul>
        {cartCtx.items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onAdd={() => cartCtx.addItem(item)}
            onRemove={() => cartCtx.removeItem(item.id)}
          />
        ))}
      </ul>
      <p className="cart-total">{formattedTotal}</p>
      <p className="modal-actions">
        <Button textOnly onClick={closeCartHandler}>
          Close
        </Button>
        {cartCtx.items.length > 0 && (
          <Button onClick={() => checkoutHandler()}>Checkout </Button>
        )}
      </p>
    </Modal>
  );
}

export default Cart;
