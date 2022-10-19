import { memo, useEffect, useRef } from 'react';
import defaultAvatar from '../../../assets/defaultAvatar.png';
import messageSound from '../../../assets/messageSound.mp3';
import './chat-list-current.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPen } from '@fortawesome/free-solid-svg-icons';
import ChatBox from '../chat_box/ChatBox';
import store from '../../../redux/store';
import { createDisplayChatBox, addMessageInChatStore, saveInReduxAndLocalStorage } from '../../../utils/chatFunction';
import { addChatRoom, setMessageStatusToReceivedInRoom } from '../../../redux/chatSlice';
import { modifiedChatRoomId, addFriendOnline, removeFriendOnline } from '../../../redux/authSlice';
import chatAPI from '../../../services/chatAPI';
import { useDispatch } from 'react-redux/es/hooks/useDispatch';
import { useSelector } from 'react-redux';
import { setToast } from '../../toast/ToastContainer';

function ChatListCurrent({ socket }) {
    const dispatch = useDispatch()
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : ''
    const currentUser = store.getState().auth.login.user.userInformation
    const currentUserId = currentUser.userId
    const roomArr = currentUser.chatRoom ? JSON.parse(currentUser.chatRoom) : null
    const displayChatArr = useSelector(state => state.chat.displayChat)
    const minimizeChatArr = useSelector(state => state.chat.minimizeChat)
    const sound = useRef()
    
    useEffect(() => {
        const payload = {
            userId: currentUserId, 
            friend: currentUser.friend ? JSON.parse(currentUser.friend) : null,
        }
        socket.current.emit('addUserOnline', payload)
        socket.current.on('serverSendFirstMessage', handleServerSendFirstMessage)
        socket.current.on('serverSendMessage', handleServerSendMessage)
        socket.current.on('serverSendFriendOnline', handleServerSendFriendOnline)
        socket.current.on('serverSendUserDisconnect', handleServerSendUserDisconnect)
        if (roomArr) {
            for (const id of roomArr) {
                socket.current.emit('joinRoom', id)
            }
        }

        async function handleServerSendFirstMessage(payload) {
            socket.current.emit('joinRoom', payload.roomId)
            const newChatRoomIdArr = roomArr ? [ ...roomArr, payload.roomId ] : [ payload.roomId ]
            const newChatRoom = JSON.stringify(newChatRoomIdArr)
            const res = await chatAPI.getMessages({ idRoomString: JSON.stringify([ payload.roomId ]) })
            store.dispatch(addChatRoom(res.data.chat))
            store.dispatch(modifiedChatRoomId(newChatRoom))
            createDisplayChatBox(null, null, null, payload.roomId)
            sound.current.play()
        }
        async function handleServerSendMessage(payload) {
            const roomArr = JSON.parse(store.getState().auth.login.user.userInformation.chatRoom) 
            const roomIndex = roomArr.indexOf(payload.roomId)
            await addMessageInChatStore(roomIndex, payload)
            const currentDisplayChatArr = JSON.parse(localStorage.getItem('displayChat'))
            if (!currentDisplayChatArr || !currentDisplayChatArr.includes(payload.roomId)) {
                createDisplayChatBox(null, null, null, payload.roomId)
                sound.current.play()
            }
        }
        function handleServerSendFriendOnline(payload) {
            dispatch(addFriendOnline(payload.userId))
            dispatch(setMessageStatusToReceivedInRoom({ userIdOnline: payload.userId, currentUserId }))
        }
        function handleServerSendUserDisconnect(payload) {
            const userDisconnect = payload.userId
            const friendListArr = currentUser.friend ? JSON.parse(currentUser.friend) : null
            if (friendListArr && friendListArr.includes(userDisconnect)) {
                dispatch(removeFriendOnline(userDisconnect))
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function handleDeleteMinimizeChat(Chat) {
        let newMinimizeChatArr = []
        if (typeof Chat !== "number") {
            newMinimizeChatArr = minimizeChatArr.filter(miniChat => miniChat.userId !== Chat.userId)
        } else {
            newMinimizeChatArr = minimizeChatArr.filter(miniChat => miniChat !== Chat)
        }
        saveInReduxAndLocalStorage('minimizeChat', newMinimizeChatArr)
    }
    function handlePopUpChatBox(chat) {
        typeof chat !== "number"
            ? createDisplayChatBox(chat.userId, chat.avatar, chat.fullName)
            : createDisplayChatBox(null, null, null, chat)
    }
    function displayMinimizeChatWithRoomID(roomId) {
        const roomArr = JSON.parse(store.getState().auth.login.user.userInformation.chatRoom)
        const roomIndex = roomArr.indexOf(roomId)
        const chatRoomMemberAvatar = store.getState().chat.chatRoomMemberAvatar[roomIndex]
        // const chatRoomMemberFullName = store.getState().chat.chatRoomMemberFullName[roomIndex]
        // const displayName = getDisplayName(chatRoomMemberFullName)
        const displayAvatar = getDisplayAvatar(chatRoomMemberAvatar)
        return (
            <li key={roomId} className="pop-up-item">
                <img 
                    src={displayAvatar ? displayAvatar : defaultAvatar} className="pop-up-image-user" 
                    alt="" onClick={() => handlePopUpChatBox(roomId)}
                />
                <div className="exit-pop-up-item" onClick={() => handleDeleteMinimizeChat(roomId)}>
                    <FontAwesomeIcon icon={faXmark} className="icon-exit"/>
                </div> 
            </li>
        )
        // function getDisplayName(chatMemberFullName) {
        //     if (chatMemberFullName.length === 2) {
        //         if (chatMemberFullName[0] === `${currentUser.firstName+' '+currentUser.lastName}`) {
        //             return chatMemberFullName[1]
        //         } else {
        //             return chatMemberFullName[0]
        //         }
        //     } else {
                
        //     }
        // }
        function getDisplayAvatar(chatMemberAvatar) {
            let displayAvatar = null
            if (chatMemberAvatar.length === 2) {
                displayAvatar = (chatMemberAvatar[0] === currentUser.avatar) ? chatMemberAvatar[1] : chatMemberAvatar[0]
            } else {
                
            }
            return displayAvatar
        }
    }

    return (
        <div className="chat-list-current">
            <audio ref={sound} src={messageSound} />
            <div className="pop-up disable-select">
                <div 
                    role="button" className="btn-circle pop-up-button"
                    onClick={() => setToast(
                        null, 
                        'Tính năng này hiện chưa hoàn thiện, chúng tôi sẽ cập nhật sau.', 
                        'notification', 
                        3500, 
                        themeMode === ' dark' ? true : false
                    )}
                >
                    <FontAwesomeIcon icon={faPen} className="pop-up-chat-icon"/>
                </div>
                <ul className="pop-up-list">
                {
                    minimizeChatArr?.map((chat, index) => { 
                        return (
                            typeof chat !== "number"
                                ?
                                <li key={index} className="pop-up-item">
                                    <img 
                                        src={chat.avatar ? chat.avatar : defaultAvatar} className="pop-up-image-user" 
                                        alt="" onClick={() => handlePopUpChatBox(chat)}
                                    />
                                    <div className="exit-pop-up-item" onClick={() => handleDeleteMinimizeChat(chat)}>
                                        <FontAwesomeIcon icon={faXmark} className="icon-exit"/>
                                    </div> 
                                </li>
                                :
                                displayMinimizeChatWithRoomID(chat)
                        )
                    })
                }
                </ul>
            </div>
            <div className="chat-box-group">
            {
                displayChatArr?.map((chat, index) => {
                    return (
                        typeof chat !== "number" 
                            ?
                            <ChatBox key={index} socket={socket} noChatPrevious={chat} />
                            :
                            <ChatBox key={index} socket={socket} roomId={chat} />
                    )

                })
            }
            </div>
        </div>
    )
}

export default memo(ChatListCurrent);
