import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import chatSlice from "./chatSlice";
import notificationSlice from "./notificationSlice";
import postSlice from "./postSlice";
import commentSlice from "./commentSlice";
import sensorSlice from "./sensorSlice";
import projectSlice from "./projectSlice";

export default configureStore({
    reducer:{
        auth: authSlice,
        chat: chatSlice,
        notification: notificationSlice,
        post: postSlice,
        comment: commentSlice,
        sensor: sensorSlice,
        project: projectSlice,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        })
})