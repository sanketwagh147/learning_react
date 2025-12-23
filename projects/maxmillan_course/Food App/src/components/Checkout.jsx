import { useContext } from 'react';
import Modal from './UI/Modal';
import CartContext from '../store/CartContext';
import { currencyFormatter } from '../util/formatting.js';
import Input from './UI/Input.jsx';
import Button from './UI/Button.jsx';
import UserProgressContext from '../store/UserProgressContext.jsx';
import useHttp from '../hooks/useHttp.js';
import Error from './UI/Error.jsx';
import { useActionState } from 'react';

const httpConfig = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
};

function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const cartTotal = cartCtx.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const formattedTotal = currencyFormatter.format(cartTotal);

  const { data, clearData, error, sendRequest } = useHttp(
    'http://localhost:3000/orders',
    httpConfig
  );

  function handleClose() {
    if (userProgressCtx.progress === 'checkout') {
      userProgressCtx.hideCheckout();
    }
  }
  async function checkoutAction(prevState, fd) {
    // Add order submission logic here
    const userData = Object.fromEntries(fd.entries());

    const order = { items: cartCtx.items, customer: userData };

    await sendRequest({ order });
  }

  const [formState, formAction, pending] = useActionState(checkoutAction, null);

  function handleSuccess() {
    handleClose();
    cartCtx.clearCart();
    clearData();
  }
  let actions = (
    <>
      <Button onClick={handleClose} textOnly type="button">
        Cancel
      </Button>
      <Button>Confirm</Button>
    </>
  );

  if (pending) {
    actions = <span>Sending order data...</span>;
  }

  if (data && !error) {
    return (
      <Modal
        open={userProgressCtx.progress === 'checkout'}
        onClose={handleSuccess}
      >
        <div>
          <h2>Order Successful!</h2>
          <p>Your order has been placed successfully.</p>
          <p className="modal-actions">
            <Button onClick={handleSuccess}>Close</Button>
          </p>
        </div>
      </Modal>
    );
  }
  return (
    <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
      <form action={formAction}>
        <h2> Checkout </h2>
        <p>Total Amount: {formattedTotal}</p>
        <Input label="Full Name" id="name" type="text" />
        <Input label="Email Address" id="email" type="email" />
        <Input label="Street Address" id="street" type="text" />
        <div className="control-row">
          <Input label="City" id="city" type="text" />
          <Input label="Postal Code" id="postal-code" type="text" />
        </div>
        {error && <Error title="Failed to submit order" message={error} />}
        <p className="modal-actions"> {actions} </p>
      </form>
    </Modal>
  );
}

export default Checkout;
