import {configureStore} from '@reduxjs/toolkit';
import counterSliceReducer from './counterSlice';
import authSliceReducer from './authSlice';




// const counterReducer = (state = { count: 0, showCounter: true }, action)=>{
//   switch (action.type) {
//     case 'INCREMENT':
//       return { ...state, count: state.count + 1 };
//     case 'DECREMENT':
//       return { ...state, count: state.count - 1 };
//     case 'INCREASE':
//       return { ...state, count: state.count + action.amount };
//     case 'TOGGLE':
//       return { ...state, showCounter: !state.showCounter };
//     default:
//       return state;
//   }

// }
// to handle multiple state slices we can set up multiple slices and combine them in the store configuration
// for example auth slice, ui slice etc
// const store = configureStore({ counter: counterSliceReducer.reducer, auth: authSliceReducer.reducer, etc: etcSliceReducer.reducer });

const store = configureStore({ reducer: {counter: counterSliceReducer, auth: authSliceReducer} });
export default store; 