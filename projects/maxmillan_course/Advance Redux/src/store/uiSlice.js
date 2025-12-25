const { createSlice } = require("@reduxjs/toolkit");


const initialUIState = {isCartVisible:false,notification:null}

const uiSlice = createSlice({
  name: "ui",
  initialState: initialUIState,
  reducers: {
    toggle(state) {
      console.log("Toggling cart");
      
      state.isCartVisible = !state.isCartVisible;
    },
    showNotification(state, action) {
      state.notification = {
        status: action.payload.status,
        title: action.payload.title,
        message: action.payload.message,
      };
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;