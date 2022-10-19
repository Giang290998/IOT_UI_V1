import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import notificationAPI from "../services/notificationAPI";

const notificationSlice = createSlice({
    name: "notification",
    initialState:{
        status: 'idle',
        friendRequest: [],
    },
    reducers:{
        modifiedFriendRequest: (state, action) => {
            state.friendRequest = action.payload
        },
        deleteNotificationStore: (state) => {
            state.status = 'idle'
            state.friendRequest = []
        },
    },
    extraReducers: builder => {
        builder.addCase(getNotification.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(getNotification.fulfilled, (state, action) => {
            state.status = 'OK'
            state.friendRequest = action.payload.allFriendRequest
        })
        builder.addCase(getNotification.rejected, (state) => {
            state.status = 'failed'
        })
    }
})

export const getNotification = createAsyncThunk('notification/getNotification', async (userId) => {
    try {
        const res = await notificationAPI.getNotification(userId)
        return res.data
    } catch (error) {
        throw new Error(error)
    }
})
export const { modifiedFriendRequest, deleteNotificationStore } = notificationSlice.actions;
export default notificationSlice.reducer;