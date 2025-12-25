import classes from './CartButton.module.css';
import { uiActions } from '../../store/uiSlice';
import { useDispatch, useSelector } from 'react-redux';

const CartButton = (props) => {

  const dispatch = useDispatch();
  const cart = useSelector(state=>state.cart);


  const toggleCartHandler = () => {
    dispatch(uiActions.toggle());
  }
  return (
    <button className={classes.button} onClick={toggleCartHandler}>
      <span>My Cart</span>
      <span className={classes.badge}>{cart.totalQuantity}</span>
    </button>
  );
};

export default CartButton;
