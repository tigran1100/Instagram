import { configureStore } from '@reduxjs/toolkit'
import user_details from './slices/user_details_redux'
import posts from './slices/posts_redux'

const store = configureStore({
  reducer: {
    user_details_redux: user_details,
    posts_redux: posts,
  },
})

export default store