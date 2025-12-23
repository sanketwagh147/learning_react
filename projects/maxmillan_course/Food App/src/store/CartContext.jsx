import { createContext, useReducer } from 'react';

// 1. Create context with default values
const CartContext = createContext({
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
  clearCart: () => {},
});

// 2 . Reducer function to manage cart state
function cartReducer(state, action) {
  if (action.type === 'ADD_ITEM') {
    const existingItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );

    const updatedItems = [...state.items];
    if (existingItemIndex > -1) {
      const existingItem = updatedItems[existingItemIndex];
      updatedItems[existingItemIndex] = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
      };
    } else {
      updatedItems.push({ ...action.item, quantity: 1 });
    }

    return {
      ...state,
      items: updatedItems,
    };
  }
  if (action.type === 'REMOVE_ITEM') {
    const existingItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );
    const updatedItems = [...state.items];

    if (existingItemIndex > 1) {
      const existingItem = state.items[existingItemIndex];

      updatedItems[existingItemIndex] = {
        ...existingItem,
        quantity: existingItem.quantity - 1,
      };
    } else {
      updatedItems.removeItem(existingItemIndex);
    }
    return { ...state, items: updatedItems };
  }

  if (action.type === 'CLEAR_CART') {
    return {
      items: [],
    };
  }
  return state;
}

// 3. Context Provider component
export function CartContextProvider({ children }) {
  const [cartState, dispatchCartAction] = useReducer(cartReducer, {
    items: [],
  });

  // 4. Action dispatchers
  function addItem(item) {
    dispatchCartAction({ type: 'ADD_ITEM', item: item });
  }

  function removeItem(id) {
    dispatchCartAction({ type: 'REMOVE_ITEM', item: { id } });
  }

  function clearCart() {
    dispatchCartAction({ type: 'CLEAR_CART' });
  }

  // 5. Context values
  const CartContextValue = {
    items: cartState.items,
    addItem: addItem,
    removeItem: removeItem,
    clearCart: clearCart,
  };
  console.log(CartContextValue.items);

  // 6. Provide context to children
  return (
    <CartContext.Provider value={CartContextValue}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
