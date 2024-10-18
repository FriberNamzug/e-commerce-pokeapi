import { createSlice } from "@reduxjs/toolkit";


export const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
    },
    reducers: {
        initData: (state, action) => {
            state.items = action.payload
        },
        add: (state, action) => {
            const existingItem = state.items.find(item => item.id_pokemon == action.payload.id_pokemon);
            if (existingItem) {
                // Si el producto ya existe, incrementa la cantidad
                existingItem.cantidad += action.payload.cantidad;
            } else {
                // Si no existe, lo agrega al carrito
                state.items.push(action.payload);
            }
        },

        remove: (state, action) => {
            const existingItem = state.items.find(item => item.id_pokemon == action.payload);
            if (existingItem) {

                if (existingItem.cantidad > 1) {
                    existingItem.cantidad -= 1; // Esto está bien, ya que se modifica una propiedad del objeto existente
                } else {
                    state.items = state.items.filter(item => item.id_pokemon !== action.payload);
                }
            }
        },

        delete: (state, action) => {
            // Elina el producto del carrito
            state.items = state.items.filter(item => item.id_pokemon !== action.payload);
        },

        clear: (state) => {
            state.items = [];
        },
    }
});
export const {
    add,
    remove,
    delete: deleteFromCart,
    clear,
    initData
} = cartSlice.actions
export default cartSlice.reducer;