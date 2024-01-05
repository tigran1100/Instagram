import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    posts_data : null
}

export const counterSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        set_posts_data: (state, action) => {
            state.posts_data = action.payload;
        },
    },
})

export const { set_posts_data } = counterSlice.actions
export default counterSlice.reducer