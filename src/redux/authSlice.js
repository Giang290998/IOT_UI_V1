import { createSlice, current } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "user",
    initialState:{
        login:{
            isFetching: false,
            error: false,
            user: null,
        },
        friendOnline: [],
        friendInfo: null,
        themeMode: null,
        weather: null,
        content: 'post',
    },
    reducers:{
        loginStart: (state) => {
            state.login.isFetching = true
        },
        saveUser: (state, action) => {
            state.login.isFetching = false
            state.login.user = action.payload
        },
        addFriendOnline: (state, action) => {
            if (!state.friendOnline.includes(action.payload)) {
                state.friendOnline = [ ...(state.friendOnline), action.payload ]
            }
        },
        setFriendOnline: (state, action) => {
            state.friendOnline = action.payload
        },
        removeFriendOnline: (state, action) => {
            let currentFriendOnline = current(state.friendOnline)
            const index = currentFriendOnline.indexOf(action.payload)
            if (currentFriendOnline.length > 1) {
                currentFriendOnline.splice(index, 1)
            } else {
                currentFriendOnline = []
            }
            state.friendOnline = currentFriendOnline
        },
        setFriendInfo: (state, action) => {
            state.friendInfo = action.payload
        },
        modifiedUserAvatar: (state, action) => {
            state.login.isFetching = false
            state.login.user.userInformation.avatar = action.payload
        },
        modifiedChatRoomId: (state, action) => {
            state.login.user.userInformation.chatRoom = action.payload
        },
        modifiedThemeMode: (state, action) => {
            state.themeMode = action.payload
        },
        setWeather: (state, action) => {
            state.weather = action.payload
        },
        setContent: (state, action) => {
            state.content = action.payload
        },
        deleteAuthStore: (state) => {
            state.login.user = null
            state.friendInfo = null
            state.friendOnline = []
        },
        loginFailed: (state) => {
            state.login.isFetching = false
            state.login.error = true
        }
    }
})

export const { 
    loginStart, saveUser, loginFailed, modifiedUserAvatar,
    modifiedChatRoomId, addFriendOnline, setFriendOnline,
    removeFriendOnline, setFriendInfo, deleteAuthStore,
    modifiedThemeMode, setWeather, setContent, 
} = authSlice.actions;
export default authSlice.reducer;