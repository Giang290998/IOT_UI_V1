import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import chatAPI from "../services/chatAPI";

const chatSlice = createSlice({
    name: "chat",
    initialState:{
        loadStatus: 'idle',
        updateStatus: 'idle',
        chatRoomMemberAvatar: null,
        chatRoomMemberFullName: null,
        chatRoomDetail: null,
        chatRoomUserId: null,
        displayChat: localStorage.getItem('displayChat') ? JSON.parse(localStorage.getItem('displayChat')) : null,
        minimizeChat: localStorage.getItem('minimizeChat') ? JSON.parse(localStorage.getItem('minimizeChat')) : null,
    },
    reducers:{
        setNoChatRoom: (state) => {
            state.loadStatus = 'OK'
        },
        modifiedDisplayChat: (state, action) => {
            state.displayChat = action.payload
        },
        modifiedMinimizeChat: (state, action) => {
            state.minimizeChat = action.payload
        },
        addMessage: (state, action) => {
            if (state.chatRoomDetail) {
                state.chatRoomDetail[action.payload.roomIndex] = 
                [ ...(state.chatRoomDetail[action.payload.roomIndex]), action.payload.newDetailChat ]
            } else {
                state.chatRoomDetail = [ action.payload.newDetailChat ]
            }
        },
        replaceChatDetail: (state, action) => {
            const indexRoom = action.payload.index
            let newChat = action.payload.chat
            let chatDetail = state.chatRoomDetail[indexRoom]
            const chatReplace = chatDetail.find(chat => chat.idTempo ? chat.idTempo === newChat.idTempo : chat.id === newChat.id)
            /*---- conditions replace ---*/
            const A = (chatReplace.messageStatus === 'pending' && newChat.messageStatus !== 'pending')
            const B = (chatReplace.messageStatus === 'received' && isArrayStatus(newChat.messageStatus))
            const C = (isArrayStatus(chatReplace.messageStatus) && isArrayStatus(newChat.messageStatus)) 
            const D = (chatReplace.messageStatus === 'sent' && newChat.messageStatus === 'received')
            const E = (chatReplace.messageStatus === 'sent' && isArrayStatus(newChat.messageStatus))
            const F = (newChat.messageStatus === 'failed') 
            if (A || B || C || D || E || F) {
                if (newChat.idTempo) {
                    delete newChat.idTempo
                }
                const indexReplace = chatDetail.indexOf(chatReplace)
                chatDetail[indexReplace] = newChat
                state.chatRoomDetail[indexRoom] = chatDetail
            }
        },
        addUserSeenToAllMessage: (state, action) => {
            const indexRoom = action.payload.index
            const userSeen = action.payload.userSeen
            let allMessage = state.chatRoomDetail[indexRoom]
            if(state.chatRoomUserId[indexRoom].length === 2) {
                allMessage.forEach(message => {
                    if (!isArrayStatus(message.messageStatus)) {
                        message.messageStatus = JSON.stringify([ userSeen ])
                    }
                })
            } else {
                allMessage.forEach(message => {
                    message.messageStatus = JSON.stringify([ ...(message.messageStatus), userSeen ])
                })
            }
            state.chatRoomDetail[indexRoom] = allMessage
        },
        setMessageStatusToReceivedInRoom: (state, action) => {
            const currentUserId = action.payload.currentUserId
            const userId = action.payload.userIdOnline
            const allRoom = current(state.chatRoomUserId)
            const chatRoom = allRoom.find(userIdInRoom => 
                userIdInRoom.length === 2 && userIdInRoom.includes(userId)
            )
            if (chatRoom) {
                let index = null
                let messagesTempo = []
                for (let i = 0; i < allRoom.length; i++) {
                    if (allRoom[i] === chatRoom) {
                        index = i;
                    }
                }
                const messagesInRoom = current(state.chatRoomDetail[index])
                messagesInRoom.forEach(message => {
                    if (message.messageStatus === 'sent' && message.userId === currentUserId) {
                        messagesTempo.push({ ...message, messageStatus: 'received'})
                    } else {
                        messagesTempo.push(message)
                    }
                })
                if (messagesTempo.length > 0) {
                    state.chatRoomDetail[index] = messagesTempo
                }
            }
        },
        setAllMessageStatusFromSentToReceived: (state) => {
            const allChatDetail = state.chatRoomDetail
            allChatDetail.forEach((allChatInRoom, index) => {
                let newAllChatInRoom = []
                allChatInRoom.forEach(message => {
                    if (message.messageStatus === 'sent') {
                        newAllChatInRoom.push({ ...message, messageStatus: 'received' })
                    } else {
                        newAllChatInRoom.push(message)
                    }
                })
                state.chatRoomDetail[index] = newAllChatInRoom
            })

        },
        addChatRoomDetail: (state, action) => {
            state.chatRoomDetail = state.chatRoomDetail
                ? [ ...(state.chatRoomDetail), ...(action.payload) ]
                : action.payload
        },
        addChatRoomMemberAvatar: (state, action) => {
            state.chatRoomMemberAvatar = state.chatRoomMemberAvatar
                ? [ ...(state.chatRoomMemberAvatar), ...(action.payload) ]
                : action.payload
        },
        addChatRoomMemberFullName: (state, action) => {
            state.chatRoomMemberFullName = state.chatRoomMemberFullName
                ? [ ...(state.chatRoomMemberFullName), ...(action.payload) ]
                : action.payload
        },
        addChatRoomUserId: (state, action) => {
            state.chatRoomUserId = state.chatRoomUserId
                ? [ ...(state.chatRoomUserId), ...(action.payload) ]
                : action.payload
        }, 
        addChatRoom: (state, action) => {
            state.chatRoomDetail = state.chatRoomDetail
                ? [ ...(state.chatRoomDetail), ...(action.payload.chatRoomDetail) ]
                : action.payload.chatRoomDetail
            state.chatRoomMemberAvatar = state.chatRoomMemberAvatar
                ? [ ...(state.chatRoomMemberAvatar), ...(action.payload.chatRoomMemberAvatar) ]
                : action.payload.chatRoomMemberAvatar
            state.chatRoomMemberFullName = state.chatRoomMemberFullName
                ? [ ...(state.chatRoomMemberFullName), ...(action.payload.chatRoomMemberFullName) ]
                : action.payload.chatRoomMemberFullName
            state.chatRoomUserId = state.chatRoomUserId
                ? [ ...(state.chatRoomUserId), ...(action.payload.chatRoomUserId) ]
                : action.payload.chatRoomUserId
        },
        deleteChatStore: (state) => {
            state.loadStatus = 'idle'
            state.updateStatus = 'idle'
            state.chatRoomDetail = null
            state.chatRoomMemberAvatar = null
            state.chatRoomMemberFullName = null
            state.chatRoomUserId = null
        },
    },
    extraReducers: builder => {
        builder.addCase(getAllMessage.pending, (state) => {
            state.loadStatus = 'loading'
        })
        builder.addCase(getAllMessage.fulfilled, (state, action) => {
            state.loadStatus = 'OK'
            state.chatRoomDetail = action.payload.chatRoomDetail
            state.chatRoomMemberAvatar = action.payload.chatRoomMemberAvatar
            state.chatRoomMemberFullName = action.payload.chatRoomMemberFullName
            state.chatRoomUserId = action.payload.chatRoomUserId
        })
        builder.addCase(getAllMessage.rejected, (state) => {
            state.loadStatus = 'failed'
        })
    },
})

function isArrayStatus(status) {
    if (status !== 'pending' && status !== 'received' && status !== 'failed' && status !== 'sent') {
        return true
    }
    return false
}

export const getAllMessage = createAsyncThunk('chat/getAllMessage', async (idRoomString) => {
    try {
        const res = await chatAPI.getMessages({ idRoomString })
        return res.data.chat
    } catch (error) {
        throw new Error(error)
    }
})

export const { 
    setNoChatRoom, addMessage, addChatRoomMemberAvatar, addChatRoomDetail,
    addChatRoomMemberFullName, addChatRoomUserId, addChatRoom, replaceChatDetail,
    addUserSeenToAllMessage, setMessageStatusToReceivedInRoom, deleteChatStore,
    setAllMessageStatusFromSentToReceived, modifiedDisplayChat, modifiedMinimizeChat,

} = chatSlice.actions;

export default chatSlice.reducer;