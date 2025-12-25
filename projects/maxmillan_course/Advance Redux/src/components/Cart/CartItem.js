import { useDispatch } from 'react-redux';
import classes from './CartItem.module.css';
import { cartActions } from '../../store/cartSlice';

const CartItem = (props) => {
  const { title, quantity, total, price, id } = props.item;
  console.log(title);
  const dispatch = useDispatch();

  const removeItemFromCartHandler = () => {
    dispatch(cartActions.removeItemFromCart(id));
  };

  const addItemToCartHandler = () => {
    dispatch(cartActions.addItemToCart({
     id: id,
     title: title,
     price: price,
    }));
  }
  

  return (
    <li className={classes.item}>
      <header>
        <h3>{title}</h3>
        <div className={classes.price}>
          ${total.toFixed(2)}{' '}
          <span className={classes.itemprice}>(${price.toFixed(2)}/item)</span>
        </div>
      </header>
      <div className={classes.details}>
        <div className={classes.quantity}>
          x <span>{quantity}</span>
        </div>
        <div className={classes.actions}>
          <button onClick={removeItemFromCartHandler}>-</button>
          <button onClick={addItemToCartHandler}>+</button>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
