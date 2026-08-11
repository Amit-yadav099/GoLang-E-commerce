import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
};

const cartSlice= createSlice({
    name:'Cart',
    initialState,
    reducers:{
        addToCart: (state, action) => {
        const item = action.payload;
        const existItem = state.cartItems.find((x) => x.productId === item.productId);
        
        if (existItem) {
            existItem.qty+=1;
        } else {
            state.cartItems.push({
                ...item,
             qty:1
            });
        }
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },

        removeFromCart: (state, action) => {
        state.cartItems = state.cartItems.filter((x) => x.productId !== action.payload);
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },

        clearCart: (state) => {
        state.cartItems = [];
        localStorage.removeItem('cartItems');
        },

        updateCartQty: (state, action) => {
            const { productId, qty } = action.payload;

            const item = state.cartItems.find(
                (item) => item.productId === productId
            );

            if (item) {
                item.qty = qty;}

            localStorage.setItem(
                "cartItems",
                JSON.stringify(state.cartItems)
            );
        },
    },
});

export const { addToCart, removeFromCart, clearCart,updateCartQty } = cartSlice.actions;
export default cartSlice.reducer;