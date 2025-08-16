import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice'
import productReducer from '../features/products/productsSlice'
import requestsReducer from '../features/requests/requestsSlice'
export const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    requests:requestsReducer,
  },
})