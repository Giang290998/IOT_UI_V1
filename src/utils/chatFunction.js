import store from "../redux/store";
import chatAPI from "../services/chatAPI";
import { addMessage, replaceChatDetail, modifiedDisplayChat, modifiedMinimizeChat } from "../redux/chatSlice";
import moment from "moment";

export const createDisplayChatBox = (userId, avatar, fullName, idRoomDB) => {
    const displayChatArr = JSON.parse(localStorage.getItem('displayChat'))
    const miniChatArr = JSON.parse(localStorage.getItem('minimizeChat'))
    if (idRoomDB) {
        let newDisplayChatArr = []
        let newMiniChatArr = []
        if (displayChatArr) {
            if (displayChatArr.length === 3) {
                let hasDisplayChat = false
                displayChatArr.forEach(chat => {
                    if (chat*1 === idRoomDB) {
                        hasDisplayChat = true
                    }
                })
                if (!hasDisplayChat) {
                    newDisplayChatArr.push(displayChatArr[1])
                    newDisplayChatArr.push(displayChatArr[2])
                    newDisplayChatArr.push(idRoomDB)
                    saveInReduxAndLocalStorage('displayChat', newDisplayChatArr)
                    if (miniChatArr) {
                        newMiniChatArr = miniChatArr.filter(miniChat => miniChat*1 !== idRoomDB)
                        newMiniChatArr.push(displayChatArr[0])
                        saveInReduxAndLocalStorage('minimizeChat', newMiniChatArr)
                    } else {
                        newMiniChatArr.push(displayChatArr[0])
                        saveInReduxAndLocalStorage('minimizeChat', newMiniChatArr)
                    }
                }
            } else {
                newDisplayChatArr = displayChatArr.includes(idRoomDB) ? displayChatArr : [ ...displayChatArr, idRoomDB ]
                saveInReduxAndLocalStorage('displayChat', newDisplayChatArr)
                if (miniChatArr) {
                    newMiniChatArr = miniChatArr.filter(miniChat => miniChat*1 !== idRoomDB)
                    saveInReduxAndLocalStorage('minimizeChat', newMiniChatArr)
                }
            }
        } else {
            if (miniChatArr) {
                newMiniChatArr = miniChatArr.filter(miniChat => miniChat*1 !== idRoomDB)
                saveInReduxAndLocalStorage('minimizeChat', newMiniChatArr)
            }
            saveInReduxAndLocalStorage('displayChat', [idRoomDB])
        }
    } else {
        let tempoChat = { userId, avatar, fullName }
        let newDisplayChatArr = []
        let newMiniChatArr = []
        let hasCreateTempoChat = false
        if (displayChatArr) {
            if (displayChatArr.length === 3) {
                let hasDisplayChat = false
                displayChatArr.forEach(chat => {
                    if (chat.userId === userId) {
                        hasDisplayChat = true
                    }
                })
                if (!hasDisplayChat) {
                    newDisplayChatArr.push(displayChatArr[1])
                    newDisplayChatArr.push(displayChatArr[2])
                    newDisplayChatArr.push(tempoChat)
                    saveInReduxAndLocalStorage('displayChat', newDisplayChatArr)
                    if (miniChatArr) {
                        newMiniChatArr = miniChatArr.filter(miniChat => miniChat.userId !== userId)
                        newMiniChatArr.push(displayChatArr[0])
                        saveInReduxAndLocalStorage('minimizeChat', newMiniChatArr)
                    } else {
                        newMiniChatArr.push(displayChatArr[0])
                        saveInReduxAndLocalStorage('minimizeChat', newMiniChatArr)
                    }
                }
            } else {
                newDisplayChatArr = displayChatArr
                displayChatArr.forEach((Chat) => {
                    if (typeof Chat !== "number" && Chat.userId === userId) {
                        hasCreateTempoChat = true
                    }
                })
                if (!hasCreateTempoChat) {
                    newDisplayChatArr.push(tempoChat)
                }
                saveInReduxAndLocalStorage('displayChat', newDisplayChatArr)
                if (miniChatArr) {
                    miniChatArr.forEach((miniChat) => {
                        if (typeof miniChat !== "number" && miniChat.userId !== userId) {
                            newMiniChatArr.push(miniChat)
                        }
                    })
                    saveInReduxAndLocalStorage('minimizeChat', newMiniChatArr)
                }
            }

        } else {
            if (miniChatArr) {
                newMiniChatArr = miniChatArr.filter(miniChat => miniChat.userId !== userId)
                saveInReduxAndLocalStorage('minimizeChat', newMiniChatArr)
            }
            saveInReduxAndLocalStorage('displayChat', [tempoChat])
        }
    }
}

export const saveInReduxAndLocalStorage = (key, value) => {
    switch (key) {
        case 'minimizeChat':
            if (value !== null || value.length > 0) {
                localStorage.setItem('minimizeChat', JSON.stringify(value))
            } else {
                localStorage.removeItem('minimizeChat')
            }
            store.dispatch(modifiedMinimizeChat(value))
            break;
        case 'displayChat':
            if (value !== null || value.length > 0) {
                localStorage.setItem('displayChat', JSON.stringify(value))
            } else {
                localStorage.removeItem('displayChat')
            }
            store.dispatch(modifiedDisplayChat(value))
            break;    
        default:
            break;
    }
}

export const createConversation = async (messageType, messageContent, toUserId) => {
    const currentUser = store.getState().auth.login.user.userInformation
    const payload = {
        fromUser: currentUser.userId,
        toUser: toUserId,
        messageType: messageType,
        messageContent: messageContent,
    }
    try {
        const res = await chatAPI.createNewConversation(payload)
        if (res.data) {
            return res.data.chatRoom.id
        }
    } catch (error) {
        console.log(error)
    }
}

export const roomIdInChatStore = (userId) => {
    const chatRoomUserId = store.getState().chat.chatRoomUserId
    const currentUser = store.getState().auth.login.user.userInformation
    const chatRoomArr = currentUser.chatRoom ? JSON.parse(currentUser.chatRoom) : null
    if (chatRoomArr) {
        let roomIndex = null
        chatRoomUserId?.forEach((userIdArr, index) => {
            if (userIdArr.length === 2 && userIdArr.includes(userId)) {
                roomIndex = index
            }
        })
        return chatRoomArr[roomIndex]
    } else {
        return null
    }
}

export const addMessageInChatStore = async (serialRoomId, payload) => {
    try {
        const detailChat = {
            id: payload.id ? payload.id : null,
            idTempo: payload.idTempo,
            chatRoomId: payload.roomId,
            userId: payload.userId,
            like: null,
            messageStatus: payload.messageStatus,
            messageType: payload.messageType,
            messageContent: payload.messageContent,
            createdAt: moment().toISOString(),
            updatedAt: moment().toISOString(),
        }
        const payloadDispatch = {
            roomIndex: serialRoomId,
            newDetailChat: detailChat,
        }
        store.dispatch(addMessage(payloadDispatch))
    } catch (error) {
        console.log(error)
    }
}

export const saveMessageInDatabase = async (indexRoom, message, roomRole) => {
    try {
        if (roomRole === 'normal') {
            message.messageStatus = 'sent'
            const res = await chatAPI.createMessage(message)
            let newMessage = res.data.messageCreate
            newMessage.idTempo = res.data.idTempo
            const payload = {
                chat: newMessage,
                index: indexRoom,
            }
            store.dispatch(replaceChatDetail(payload))
            return res.data.messageCreate.id
        } else {

        }
    } catch (error) {
        message.messageStatus = 'failed'
        const payload = {
            chat: message,
            index: indexRoom,
        }
        store.dispatch(replaceChatDetail(payload))
        console.error(error)
        return null
    }
}

export const modifiedMessageInDatabase = async (message) => {
    try {
        await chatAPI.updateMessage({ messageId: message.id, messageStatus: message.messageStatus})
    } catch (error) {
        console.log(error)
    }
}

export const modifiedManyMessageStatusInRoomAtDatabase = async (roomId, roomRole, newStatus, userId) => {
    try {
        await chatAPI.updateManyMessage({ roomId, roomRole, newStatus, userId })
    } catch (error) {
        console.log(error)
    }
}

export const modifiedAllMessageStatusInDatabaseFromSentToReceived = async (userId, allRoomId) => {
    try {
        const allChatDetail = store.getState().chat.chatRoomDetail
        let hasMessageStatusSuccess = false
        for (let i = 0; i < allChatDetail.length; i++) {
            for (let j = 0; j < allChatDetail[i].length; j++) {
                if (allChatDetail[i][j].messageStatus === 'sent' && allChatDetail[i][j].userId !== userId) {
                    hasMessageStatusSuccess = true;
                    break;
                }
            }
            if (hasMessageStatusSuccess) {
                break;
            }
        }
        console.log(hasMessageStatusSuccess)
        if (hasMessageStatusSuccess) {
            await chatAPI.updateAllMessageStatusToRealtime({ userId, allRoomId, newStatus: 'received' })
        }
    } catch (error) {
        console.log(error)
    }
}
