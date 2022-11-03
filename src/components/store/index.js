import { configureStore } from "@reduxjs/toolkit";
import auth_Slice, { loadUser } from './authSlice'
import profile_Slice from "./profileSlice";



const store = configureStore({
    reducer:{
        auth: auth_Slice.reducer,
        profile: profile_Slice.reducer
    },
})

store.dispatch(loadUser(null));
export default store;