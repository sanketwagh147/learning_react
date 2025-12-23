import { currencyFormatter } from '../util/formatting';
function CartItem({ item, onAdd, onRemove }) {
  return (
    <li className="cart-item">
      <p className="flex">
        <span>{item.name}</span> <span>{item.quantity}</span>{' '}
        <span>{currencyFormatter.format(item.price * item.quantity)}</span>
      </p>
      <p className="cart-item-actions">
        <button onClick={onRemove}>-</button>
        <span>{item.quantity}</span>
        <button onClick={onAdd}>+</button>
      </p>
    </li>
  );
}

export default CartItem;
