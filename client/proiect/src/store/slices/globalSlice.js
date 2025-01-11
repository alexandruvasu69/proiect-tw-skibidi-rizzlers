import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loggedIn: false,
    checkTokenLoading: true,
    token: null,
    role: null,
    userId: null
}

export const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setLoggedIn: (state, action) => {
            state.loggedIn = action.payload;
        },
        setCheckTokenLoading: (state, action) => {
            state.checkTokenLoading = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setRole: (state, action) => {
            state.role = action.payload;
        },
        setUserId: (state, action) => {
            state.userId = action.payload;
        }
    }
});

export const { setLoggedIn, setCheckTokenLoading, setToken, setRole, setUserId } = globalSlice.actions;

export default globalSlice.reducer;