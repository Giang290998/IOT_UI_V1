import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import commentAPI from "../services/commentAPI";

const commentSlice = createSlice({
    name: "comment",
    initialState:{
        status: 'idle',
        parentComment: null,
        replyComment: null,
        replyChildComment: null,
    },
    reducers:{
        addParentComment: (state, action) => {
            const comment = action.payload.length > 0 ? action.payload : [action.payload]
            state.parentComment = state.parentComment 
                ? JSON.stringify([ ...(JSON.parse(state.parentComment)), ...(comment) ]) 
                : JSON.stringify([ ...(comment) ])
        },
        addReplyComment: (state, action) => {
            const comment = action.payload.length > 0 ? action.payload : [action.payload]
            state.replyComment = state.replyComment 
                ? JSON.stringify([ ...(JSON.parse(state.replyComment)), ...(comment) ]) 
                : JSON.stringify([ ...(comment) ])
        },
        addReplyChildComment: (state, action) => {
            const comment = action.payload.length > 0 ? action.payload : [action.payload]
            state.replyChildComment = state.replyChildComment 
                ? JSON.stringify([ ...(JSON.parse(state.replyChildComment)), ...(comment) ]) 
                : JSON.stringify([ ...(comment) ])
        },
        deleteCommentStore: (state => {
            state.status = 'idle'
            state.parentComment = null
            state.replyChildComment = null
            state.replyComment = null
        })
    },
    extraReducers: builder => {
        builder.addCase(createComment.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(createComment.fulfilled, (state, action) => {
            state.status = 'OK'
            const idTempo = action.payload.idTempo
            for (const key in action.payload) {
                switch (key) {
                    case "newParentComment":
                        let parentCommentArr = JSON.parse(state.parentComment)
                        let newParentComment = action.payload.newParentComment
                        const parentCommentTempo = parentCommentArr.find(comment => comment.idTempo === idTempo )
                        const index = parentCommentArr.indexOf(parentCommentTempo)
                        newParentComment = 
                        { ...newParentComment, userAvatar: parentCommentTempo.userAvatar, userFullName: parentCommentTempo.userFullName }
                        parentCommentArr[index] = newParentComment
                        state.parentComment = JSON.stringify(parentCommentArr)
                        break;
                    case "newReplyComment":
                        let replyCommentArr = JSON.parse(state.replyComment)
                        let newReplyComment = action.payload.newReplyComment
                        console.log(replyCommentArr, newReplyComment)
                        const replyCommentTempo = replyCommentArr.find(comment => comment.idTempo === idTempo)
                        const index1 = replyCommentArr.indexOf(replyCommentTempo)
                        console.log(index1)
                        newReplyComment = 
                        { ...newReplyComment, userAvatar: replyCommentTempo.userAvatar, userFullName: replyCommentTempo.userFullName }
                        replyCommentArr[index1] = newReplyComment 
                        console.log(replyCommentArr)
                        state.replyComment = JSON.stringify(replyCommentArr)
                        break;
                    case "newReplyChildComment":
                        let replyChildCommentArr = JSON.parse(state.replyChildComment)
                        let newReplyChildComment = action.payload.newReplyChildComment
                        const replyChildCommentTempo = replyChildCommentArr.find(comment => comment.idTempo === idTempo)
                        const index2 = replyChildCommentArr.indexOf(replyChildCommentTempo)
                        newReplyChildComment = 
                        { ...newReplyChildComment, userAvatar: replyChildCommentTempo.userAvatar, userFullName: replyChildCommentTempo.userFullName }
                        replyChildCommentArr[index2] = newReplyChildComment 
                        state.replyChildComment = JSON.stringify(replyChildCommentArr)
                        break;
                    default:
                        break;
                }
            }
        })
        builder.addCase(createComment.rejected, (state) => {
            state.status = 'failed'
        })
    }
})

export const createComment = createAsyncThunk('post/createComment', async (comment) => {
    try {
        const res = await commentAPI.createComment(comment)
        return res.data
    } catch (error) {
        throw new Error(error)
    }}
)

export const { 
    addParentComment, addReplyComment, addReplyChildComment, 
    deleteCommentStore,
} = commentSlice.actions;
export default commentSlice.reducer;