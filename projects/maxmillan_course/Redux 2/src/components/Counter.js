import classes from './Counter.module.css';
import { useSelector,useDispatch,connect } from 'react-redux';
// import { Component } from 'react';
import { counterActions } from '../store/counterSlice.js';

const Counter = () => {

  // sets subscription to the store automatically
  const counter = useSelector(state => state.counter.count);
  const showCounter = useSelector(state => state.counter.showCounter);
  const dispatch = useDispatch();

  const incrementHandler = () => {
    dispatch(counterActions.increment());
  };
  const increase = () => {
    dispatch(counterActions.increase(5));
  };

  const decrementHandler = () => {
    dispatch(counterActions.decrement());
  };

  const toggleCounterHandler = () => {
    dispatch(counterActions.toggle());
  };

  return (
    <main className={classes.counter}>
      <h1>Redux Counter</h1>
      {showCounter && <div className={classes.value}>{counter}</div>}
      <div>
        <button onClick={incrementHandler} className="increment">Increment</button>
        <button onClick={increase} className="increment">Increase by 5</button>
        <button onClick={decrementHandler} className="decrement">Decrement</button>
      </div>
      <button onClick={toggleCounterHandler}>Toggle Counter</button>
    </main>
  );
};

export default Counter;


// class Counter extends Component {

//   incrementHandler() {
//     // dispatch({type: 'INCREMENT'});
//     this.props.increment();
//   };

//   decrementHandler() {
//     // dispatch({type: 'DECREMENT'});
//     this.props.decrement();
//   };



//   render() {
//     return (
//       <main className={classes.counter}>
//         <h1>Redux Counter</h1>
//         <div className={classes.value}>{this.props.counter}</div>
//         <div>
//           <button onClick={this.incrementHandler.bind(this)} className="increment">Increment</button>
//         <button onClick={this.decrementHandler.bind(this)} className="decrement">Decrement</button>
//       </div>
//       <button onClick={this.toggleCounterHandler}>Toggle Counter</button>
//     </main>
//   );
// }
// }

// const mapStateToProps = (state) => {
//   return {
//     counter: state.count
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     increment: () => dispatch({type: 'INCREMENT'}),
//     decrement: () => dispatch({type: 'DECREMENT'})
//   };
// }



// // This connect takes 2 arguments mapStateToProps and mapDispatchToProps which are used to connect the component to the redux store
// export default connect(mapStateToProps, mapDispatchToProps)(Counter) ;