import { createSlice } from '@reduxjs/toolkit';

const initialCounterState = { count: 0, showCounter: true };
// we can mutate the state directly in createSlice reducers because it uses immer library internally which takes care of immutability and creates a new state behind the scenes 
const counterSliceReducer = createSlice({
  name: 'counter',
  initialState: initialCounterState,
  reducers: {
    increment(state) {
      state.count++;
    },
    decrement(state) {
      state.count--;
    },
    increase(state, action) {
      state.count = state.count + action.payload;
    },
    toggle(state) {
      state.showCounter = !state.showCounter;
    }
  }
});

export default counterSliceReducer.reducer;
// For single slice setup
// const store = configureStore({ reducer: {counter: counterSliceReducer.reducer} });
export const counterActions = counterSliceReducer.actions;
