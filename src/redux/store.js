import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import chatSlice from "./chatSlice";
import notificationSlice from "./notificationSlice";
import postSlice from "./postSlice";
import commentSlice from "./commentSlice";

export default configureStore({
    reducer:{
        auth: authSlice,
        chat: chatSlice,
        notification: notificationSlice,
        post: postSlice,
        comment: commentSlice,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        })
})