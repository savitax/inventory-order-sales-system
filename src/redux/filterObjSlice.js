// src/redux/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const filterObjSlice = createSlice({
    name: 'filterObj',
    initialState: {
    },
    reducers: {
        update(state, action) {
            return action.payload;
        }
    }
});

export const { update } = filterObjSlice.actions;
export default filterObjSlice.reducer;