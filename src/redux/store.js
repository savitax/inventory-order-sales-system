// store.js
import { configureStore } from '@reduxjs/toolkit';
import filterObjReducer from './filterObjSlice'

const store = configureStore({
    reducer: {
        filterObj: filterObjReducer
    },
});

export default store;