import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    data: null,
}

export const counterSlice = createSlice({
    name: 'user_details',
    initialState,
    reducers: {
        set_user_details: (state, action) => {
            state.data = action.payload;
        },
    },
})

export const { set_user_details } = counterSlice.actions
export default counterSlice.reducer