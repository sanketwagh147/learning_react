import { CartContext } from '../store/shopping-cart-context';
import { useContext } from 'react';
// import { use } from 'react'; // can use in if else condition for versions greater than 19

export default function Cart() {
  const { items } = useContext(CartContext);
  // We can use CartContext.Consumer for older versions of React
  // For this we need to wrap the JSX inside <CartContext.Consumer>{(ctx) => ( ... )}</CartContext.Consumer>
  // this can help to get rid of useContext hook
  // example usage:
  // return (
  //   <CartContext.Consumer>
  //     {(ctx) => (
  //       <div id="cart">
  //         ...
  //       </div>
  //     )}
  //   </CartContext.Consumer>
  // );
  const { updatedItemQuantity: onUpdateItemQuantity } = useContext(CartContext);

  const totalPrice = items.reduce(
    (accumulator, item) => accumulator + item.price * item.quantity,
    0
  );
  const formattedTotalPrice = `$${totalPrice.toFixed(2)}`;

  return (
    <div id="cart">
      {items.length === 0 && <p>No items in cart!</p>}
      {items.length > 0 && (
        <ul id="cart-items">
          {items.map((item) => {
            const formattedPrice = `$${item.price.toFixed(2)}`;

            return (
              <li key={item.id}>
                <div>
                  <span>{item.name}</span>
                  <span> ({formattedPrice})</span>
                </div>
                <div className="cart-item-actions">
                  <button onClick={() => onUpdateItemQuantity(item.id, -1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => onUpdateItemQuantity(item.id, 1)}>
                    +
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <p id="cart-total-price">
        Cart Total: <strong>{formattedTotalPrice}</strong>
      </p>
    </div>
  );
}
