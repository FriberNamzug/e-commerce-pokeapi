import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/slice/authSlice'
import cartReducer from '@/store/slice/cartSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer
    }
})

export default store;