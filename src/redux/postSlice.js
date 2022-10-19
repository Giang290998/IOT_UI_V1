import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postAPI from "../services/postAPI";

const postSlice = createSlice({
    name: "post",
    initialState:{
        status: 'idle',
        postArr: null,
    },
    reducers:{
        modifiedPost: (state, action) => {
            state.friendRequest = action.payload
        },
        deletePostStore: (state) => {
            state.status = 'idle'
            state.postArr = null
        },
    },
    extraReducers: builder => {
        builder.addCase(getAllPost.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(getAllPost.fulfilled, (state, action) => {
            state.status = 'OK'
            state.postArr = action.payload
        })
        builder.addCase(getAllPost.rejected, (state) => {
            state.status = 'failed'
        })
    }
})


export const getAllPost = createAsyncThunk('post/getAllPost', async (userId) => {
    try {
        const res = await postAPI.getAllPostHomePage(userId)
        return res.data.allPost
    } catch (error) {
        throw new Error(error)
    }
})

export const { modifiedPost, deletePostStore } = postSlice.actions;
export default postSlice.reducer;