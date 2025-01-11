import { configureStore } from '@reduxjs/toolkit';
import globalSlice from './slices/globalSlice.js';

export default configureStore({
    reducer: {
        global: globalSlice
    }
})