import { configureStore } from '@reduxjs/toolkit'
import user_details from './slices/user_details_redux'

const store = configureStore({
  reducer: {
    user_details_redux: user_details,
  },
})

export default store