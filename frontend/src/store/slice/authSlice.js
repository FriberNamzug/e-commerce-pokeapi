import { createSlice } from "@reduxjs/toolkit";


const getInitialState = () => {
    const token = localStorage.getItem('token-pokeapi');
    const userData = JSON.parse(localStorage.getItem('userData-pokeapi'));

    return {
        token: token || null,
        isAuthenticated: !!token,
        nombre: userData ? userData.nombre : null,
        email: userData ? userData.email : null,
    };
};

export const authSlice = createSlice({
    name: "auth",
    initialState: getInitialState(),
    reducers: {
        login: (state, action) => {
            const token = action.payload.token
            state.token = token
            state.isAuthenticated = true
            state.nombre = action.payload.nombre
            state.email = action.payload.email
            localStorage.setItem('token-pokeapi', token);
            localStorage.setItem('userData-pokeapi', JSON.stringify({
                nombre: action.payload.nombre,
                email: action.payload.email
            }));
        },
        logout: (state) => {
            state.token = null
            state.isAuthenticated = false
            state.nombre = null
            state.email = null

            localStorage.removeItem('token-pokeapi');
            localStorage.removeItem('userData-pokeapi');
        },
    }
});
export const {
    login,
    logout,
} = authSlice.actions
export default authSlice.reducer;