/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-use-before-define */
import { memo, useEffect, useRef, useState, useCallback } from 'react';
import './chat_box.scss';
import defaultAvatar from '../../../assets/defaultAvatar.png';
import data from '@emoji-mart/data';
import { Picker } from 'emoji-mart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPaperPlane, faXmark, faPhone, faAngleDown, faVideo, 
    faMinus, faFile, faFileImage, faFaceSmile, faThumbsUp, faCirclePlus, faFileLines, faArrowDown 
} from '@fortawesome/free-solid-svg-icons';
import {
    Grid, 
    // SearchBar, SearchContext, SearchContextManager, SuggestionBar, 
} from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { PickerComponent, 
    // StoreComponent, SearchComponent, UnifiedComponent 
} from 'stipop-react-sdk';
import Message from '../message/Message';
import { 
    addMessageInChatStore, createConversation, saveMessageInDatabase,
    modifiedMessageInDatabase, modifiedManyMessageStatusInRoomAtDatabase,
    saveInReduxAndLocalStorage,  
} from '../../../utils/chatFunction';
import store from '../../../redux/store';
import { modifiedChatRoomId } from '../../../redux/authSlice';
import { addChatRoom, replaceChatDetail, addUserSeenToAllMessage } from '../../../redux/chatSlice';
import chatAPI from '../../../services/chatAPI';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import uploadToCloudinary from '../../../utils/uploadToCloudinary';
import { setToast } from '../../toast/ToastContainer';

function ChatBox({ roomId, socket, noChatPrevious }) {
    const gf = new GiphyFetch(process.env.REACT_APP_GIPHY_KEY)
    const fetchGifs = (offset) => gf.trending({ offset, limit: 10 })
    const $ = document.querySelector.bind(document)
    const $$ = document.querySelectorAll.bind(document)
    const dispatch = useDispatch()
    const displayChatBox = handleGetChatBoxStatus()
    const currentUser = store.getState().auth.login.user.userInformation
    const friendListArr = currentUser.friend ? JSON.parse(currentUser.friend) : null
    const chatRoomIdArr = currentUser.chatRoom ? JSON.parse(currentUser.chatRoom) : null
    const userFocus = useRef([])
    const isSendFocus = useRef(false)
    const isSendBlur = useRef(false)
    const [isTyping, setIsTyping] = useState(false)
    const [textChat, setTextChat] = useState(null)
    const [displayScrollToEndButton, setDisplayScrollToEndButton] = useState(false)
    const [filePreview, setFilePreview] = useState(null)
    const [statusChat, setStatusChat] = useState('short')
    const roomIndex = roomId ? chatRoomIdArr.indexOf(roomId) : null
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : '';
    const friendOnline = useSelector(state => state.auth.friendOnline)
    const chatDetail = useSelector(state => roomIndex !== null ? state.chat.chatRoomDetail[roomIndex] : null)
    const chatMemberAvatar = useSelector(state => roomIndex !== null ? state.chat.chatRoomMemberAvatar[roomIndex] : null)
    const chatMemberFullName = useSelector(state => roomIndex !== null ? state.chat.chatRoomMemberFullName[roomIndex] : null)
    const chatRoomUserId = useSelector(state => roomIndex !== null ? state.chat.chatRoomUserId[roomIndex] : null)
    const chatRole = noChatPrevious ? 'normal' : chatRoomUserId.length === 2 ? 'normal' : 'group';
    let partnerUserId = null
    let partnerOnline = null
    let id = null
    let displayName = null
    let avatarChatBox = null
    let isFriend = null

    const getDisplayName = useCallback((chatMemberFullName) => {
        if (chatMemberFullName.length === 2) {
            if (chatMemberFullName[0] === `${currentUser.firstName+' '+currentUser.lastName}`) {
                return chatMemberFullName[1]
            }
            return chatMemberFullName[0]
        } else {
            
        }
    }, [])

    const getDisplayAvatar = useCallback((chatMemberAvatar) => {
        if (chatMemberAvatar.length === 2) {
            if (chatMemberAvatar[0] === currentUser.avatar) {
                return chatMemberAvatar[1]
            }
            return chatMemberAvatar[0]
        } else {
            
        }
    }, [])

    if (roomId) {
        id = roomId
        displayName = getDisplayName(chatMemberFullName)
        avatarChatBox = getDisplayAvatar(chatMemberAvatar)
        if (chatRoomUserId.length === 2) {
            partnerUserId = chatRoomUserId.find(id => id !== currentUser.userId)
            partnerOnline = friendOnline.includes(partnerUserId) ? true : false
            isFriend = friendListArr?.includes(partnerUserId) ? true : false
        } else {
            
        }
    } else {
        id = noChatPrevious.userId
        displayName = noChatPrevious.fullName
        avatarChatBox = noChatPrevious.avatar
        isFriend = friendListArr?.includes(noChatPrevious.userId) ? true : false
    }

    const handleSendUserBlurChatBox = useCallback(() => {
        const payload = {
            userId: currentUser.userId,
            roomId: roomId,
        }
        socket.current.emit('clientSendUserBlurChatBox', payload)
    }, [])

    const handleServerSendUserFocusChatBox = useCallback((payload) => {
        const chatArr = store.getState().chat.chatRoomDetail[roomIndex]
        const hasMessageStatusRealtime = chatArr.find(chat => 
            chat.messageStatus === 'received' && chat.userId === currentUser.userId
        )
        if (payload.roomId === roomId && hasMessageStatusRealtime) {
            if (!userFocus.current.includes(payload.userId)) {
                userFocus.current = [ ...(userFocus.current), payload.userId ]
            }
            const payloadDispatch = {
                index: roomIndex,
                userSeen: payload.userId,
            }
            dispatch(addUserSeenToAllMessage(payloadDispatch))
            modifiedManyMessageStatusInRoomAtDatabase(roomId, chatRole, JSON.stringify(userFocus.current), currentUser.userId)
        }
    }, [])

    const handleServerSendUserBlurChatBox = useCallback((payload) => {
        if (payload.roomId === roomId) {
            const index = userFocus.current.indexOf(payload.userId)
            userFocus.current.splice(index, 1)
        }
    }, [])

    const handleServerSendBackUserOnline = useCallback((payload) => {
        let newMessageStatus = null
        if (partnerUserId) {
            if (payload.userOnline.includes(partnerUserId)) {
                if (userFocus.current.includes(partnerUserId)) {
                    newMessageStatus = JSON.stringify([ partnerUserId ])
                } else {
                    newMessageStatus = 'received'
                }
            } else {
                newMessageStatus = 'pending'
            }
        } else {
            if (userFocus.current.length > 0) {
                let tempo = []
                payload.userOnline.forEach(user => {
                    const userMatch = userFocus.current.find(userOnline => userOnline === user)
                    if (userMatch) {
                        tempo.push(userMatch)
                    }
                })
                if (tempo.length > 0) {
                    newMessageStatus = JSON.stringify(tempo)
                } else {
                    newMessageStatus = 'pending'
                }
            }
            newMessageStatus = 'pending'
        }
        payload.messageStatus = newMessageStatus
        if (newMessageStatus !== 'pending') {
            modifiedMessageInDatabase(payload)
            // update message in store
            const newPayload ={
                index: roomIndex,
                chat: payload,
            }
            dispatch(replaceChatDetail(newPayload))
        }
    }, [])

    const handleServerSendUserTyping = useCallback((payload) => {
        console.log('serverSendUserTyping', payload.roomId, roomId)
        if (payload.roomId === roomId) {
            setIsTyping(true)
        }
    }, [])

    const handleServerSendUserStopTyping = useCallback((payload) => {
        console.log('serverSendUserStopTyping', payload.roomId, roomId)
        if (payload.roomId === roomId) {
            setIsTyping(false)
        }
    }, [])

    const scrollToEndMessageBody = useCallback(() => {
        const messageBody = document.querySelector(`div[id="chat-box-content-${id}"]`)
        if (messageBody) {
            if (messageBody.scrollHeight > messageBody.offsetHeight) {
                messageBody.scrollTop = messageBody.scrollHeight
            }
        }
    }, [])

    useEffect(() => {
        scrollToEndMessageBody()
    }, [chatDetail])
    useEffect(() => {
        socket.current.on('serverSendUserTyping', handleServerSendUserTyping)
        socket.current.on('serverSendUserStopTyping', handleServerSendUserStopTyping)
        socket.current.on('serverSendUserFocusChatBox', handleServerSendUserFocusChatBox)
        socket.current.on('serverSendUserBlurChatBox', handleServerSendUserBlurChatBox)
        socket.current.on('serverSendBackUserOnline', handleServerSendBackUserOnline)
        return () => {
            socket.current.off('serverSendUserTyping', handleServerSendUserTyping)
            socket.current.off('serverSendUserStopTyping', handleServerSendUserStopTyping)
            socket.current.off('serverSendUserFocusChatBox', handleServerSendUserFocusChatBox)
            socket.current.off('serverSendUserBlurChatBox', handleServerSendUserBlurChatBox)
        }
    }, [])
    useEffect(() => {
        window.addEventListener('click', controlClickChatBox)
        return () => {
            window.removeEventListener('click', controlClickChatBox)
        }

        function controlClickChatBox(event){
            const chatBox = $(`div[id="chat-box-${id}"]`)
            const stickerGroup = $(`div[id="sticker-group-${id}"]`)
            const stickerButton = $(`div[id="sticker-button-${id}"]`)
            const gifGroup = $(`div[id="gif-group-${id}"]`)
            const gifButton = $(`div[id="gif-button-${id}"]`)
            const emoteGroup = $(`div[id="emote-group-${id}"]`)
            const emoteButton = $(`div[id="emote-button-${id}"]`)
            const minimizeChatButton = $(`div[id="minimize-chat-box-${id}"]`)
            const deleteChatButton = $(`div[id="delete-chat-box-${id}"]`)

            controlClickButton(stickerButton, stickerGroup)
            controlClickButton(gifButton, gifGroup)
            controlClickButton(emoteButton, emoteGroup)

            if (
                chatBox.contains(event.target) && 
                !minimizeChatButton.contains(event.target) && 
                !deleteChatButton.contains(event.target)
            ) {
                if (!isSendFocus.current) {
                    handleSendUserFocusChatBox()
                    isSendFocus.current = true
                    isSendBlur.current = false
                }
                $(`div[id="chat-content-${id}"]`).focus()
                document.execCommand('selectAll', false, null)
                document.getSelection().collapseToEnd()
                changeColorIconToBlue()
                const moreButton = $(`span[id="more-button-${id}"]`)
                const leftButtonGroup = $(`div[id="left-button-group-${id}"]`)
                if (moreButton.contains(event.target)) {
                    leftButtonGroup.classList.contains('hidden')
                        ? leftButtonGroup.classList.remove('hidden')
                        : leftButtonGroup.classList.add('hidden')
                } else {
                    if (!moreButton.classList.contains('hidden')) {
                        leftButtonGroup.classList.add('hidden')
                    }
                }
            } else{
                if (!isSendBlur.current) {
                    handleSendUserBlurChatBox()
                    isSendBlur.current = true
                    isSendFocus.current = false
                }
                changeColorIconToGray()
            }
            
            function controlClickButton(button, group) {
                if (button.contains(event.target)) {
                    group.classList.contains('hidden')
                        ? group.classList.remove('hidden')
                        : group.classList.add('hidden')
                } else {
                    if (!group.contains(event.target)) {
                        group.classList.add('hidden')
                    }
                }
            }
            function changeColorIconToBlue() {
                const iconChatBox = $$(`svg[id="chat-box-icon-${id}"]`)
                const iconNav = $$(`svg[id="icon-chat-nav-${id}"]`)
                $(`div[id="sticker-btn-${id}"]`).setAttribute('style', 'background-color: rgb(32, 140, 235);')
                $(`span[id="gif-icon-${id}"]`).setAttribute('style', 'background-color: rgb(32, 140, 235);')
                iconChatBox.forEach((icon) => {
                    icon.setAttribute('style','color: rgb(32, 140, 235);')
                })
                iconNav.forEach((icon) => {
                    icon.setAttribute('style','color: rgb(32, 140, 235);')
                })
            }
            function changeColorIconToGray() {
                const iconChatBox = $$(`svg[id="chat-box-icon-${id}"]`)
                const iconNav = $$(`svg[id="icon-chat-nav-${id}"]`)
                $(`div[id="sticker-btn-${id}"]`).removeAttribute('style')
                $(`span[id="gif-icon-${id}"]`).removeAttribute('style')
                iconChatBox.forEach((icon) => {
                    icon.setAttribute('style','color: gray;')
                })
                iconNav.forEach((icon) => {
                    icon.setAttribute('style','color: gray;')
                })
            }
            function handleSendUserFocusChatBox() {
                const payload = {
                    userId: currentUser.userId,
                    roomId: roomId,
                }
                socket.current.emit('clientSendUserFocusChatBox', payload)
            }
        }
    }, [])
    
    function handleGetChatBoxStatus() {
        const minimizeChatArr = JSON.parse(localStorage.getItem('minimizeChat'))
        if (minimizeChatArr) {
            if (roomId) {
                if (minimizeChatArr.includes(roomId)) {
                    return 'hidden'
                }
                return null
            } else {
                let isHidden = false
                minimizeChatArr.forEach(miniChat => {
                    if (miniChat.userId === noChatPrevious.userId) {
                        isHidden = true
                    }
                })
                return isHidden ? 'hidden' : null
            }
        } else {
            return null
        }
    }
    async function handlePreviewFile(event) {
        console.log(event.target.files[0])
        const file = event.target.files[0]
        const inputFile = $(`input[id="input-file-chat-box-${id}"]`)
        setFilePreview(file)
        longTextChat()
        inputFile.value = null
    }
    function handleChangeTextChat(event) {
        let currentTextChat = null
        if (event) {
            currentTextChat = event.currentTarget.textContent
        }
        setTextChat(currentTextChat)
        const emojiChat = $(`div[id="chat-content-${id}"]`).textContent
        if ((currentTextChat && !textChat) || emojiChat || filePreview) {
            longTextChat()
        } else {
            shortTextChat()
        }
    }
    function shortTextChat() {
        if (statusChat === 'long') {
            $(`div[id="chat-content-${id}"]`).setAttribute('style', 'width: 134px;')
            $(`div[id="left-button-group-${id}"]`).classList.remove('hidden')
            $(`div[id="left-button-group-${id}"]`).classList.remove('column')
            $(`span[id="more-button-${id}"]`).classList.add('hidden')
            $(`span[id="placeholder-chat-box-${id}"]`).classList.remove('hidden')
            stopTypingMessage()
            setStatusChat('short')
        }
    }
    function longTextChat() {
        if (statusChat === 'short') {
            $(`div[id="chat-content-${id}"]`).setAttribute('style', 'width: 200px;')
            $(`div[id="left-button-group-${id}"]`).classList.add('hidden')
            $(`div[id="left-button-group-${id}"]`).classList.add('column')
            $(`span[id="more-button-${id}"]`).classList.remove('hidden')
            $(`span[id="placeholder-chat-box-${id}"]`).classList.add('hidden')
            typingMessage()
            setStatusChat('long')
        }
    }
    function typingMessage() {
        const payload = { roomId: roomId, userTyping: currentUser.userId }
        socket.current.emit('clientTypingMessage', payload)
    }
    function stopTypingMessage() {
        const payload = { roomId: roomId, userStopTyping: currentUser.userId}
        socket.current.emit('clientStopTypingMessage', payload)
    }
    function handlePressKeyChatBox(event) {       
        if (event.key === 'Enter') {
            event.preventDefault()
            $(`div[id="send-message-${id}"]`).click()
        }
    }
    async function handleSendTextMessage() {
        setTextChat(null)
        $(`div[id="chat-content-${id}"]`).textContent = null
        shortTextChat()
        if (noChatPrevious) {
            const messageType = 'text'
            const messageContent = textChat
            handleSendFirstMessage(messageType, messageContent, noChatPrevious)
        } else {
            const roomIndex = chatRoomIdArr.indexOf(roomId)
            if (filePreview) {
                setFilePreview(null)
                const payloadTempo = {
                    roomId: roomId,
                    idTempo: uuidv4(),
                    userId: currentUser.userId,
                    messageStatus: 'pending',
                    messageType: 'file',
                    messageContent: filePreview,
                }
                await addMessageInChatStore(roomIndex, payloadTempo)
                const fileURL = await uploadToCloudinary.file(filePreview)
                const fileSend = {
                    name: filePreview.name,
                    type: filePreview.type,
                    content: fileURL,
                }
                const payloadFile = { ...payloadTempo, messageContent: JSON.stringify(fileSend) }
                const id = await saveMessageInDatabase(roomIndex, payloadFile, chatRole)
                if (id) {
                    payloadFile.id = id
                    socket.current.emit('clientSendMessage', payloadFile)
                }
            }
            if (textChat) {
                const payloadText = {
                    roomId: roomId,
                    idTempo: uuidv4(),
                    userId: currentUser.userId,
                    messageStatus: 'pending',
                    messageType: 'text',
                    messageContent: textChat,
                }
                await addMessageInChatStore(roomIndex, payloadText)
                const id = await saveMessageInDatabase(roomIndex, payloadText, chatRole)
                if (id) {
                    payloadText.id = id
                    socket.current.emit('clientSendMessage', payloadText)
                }
            }
        }
    }
    async function handleSendFirstMessage(messageType, messageContent, noChatPrevious) {
        let newDisplayChatArr = null
        const toUserId = noChatPrevious.userId
        const displayChatArr = JSON.parse(localStorage.getItem('displayChat'))
        const idRoom = await createConversation(messageType, messageContent, toUserId)
        const newChatRoomIdArr = chatRoomIdArr ? [ ...chatRoomIdArr, idRoom ] : [ idRoom ]
        const newChatRoom = JSON.stringify(newChatRoomIdArr)
        socket.current.emit('joinRoom', idRoom)
        const payload = {
            roomId: idRoom,
            fromUserId: currentUser.userId,
            fromUserAvatar: noChatPrevious.avatar,
            toUserId: toUserId,
            messageType: messageType,
            messageContent: messageContent,
        }
        socket.current.emit('clientSendFirstMessage', payload)
        const res = await chatAPI.getMessages({ idRoomString: JSON.stringify([ idRoom ]) })
        dispatch(addChatRoom(res.data.chat))
        dispatch(modifiedChatRoomId(newChatRoom))
        if (displayChatArr) {
            newDisplayChatArr = displayChatArr.map(chat => chat.userId === noChatPrevious.userId ? idRoom : chat)
        } else {
            newDisplayChatArr = [ idRoom ]
        }
        saveInReduxAndLocalStorage('displayChat', newDisplayChatArr)
    }
    async function handleSendSticker(res) {
        if (noChatPrevious) {
            const messageType = 'sticker'
            const messageContent = res.url
            handleSendFirstMessage(messageType, messageContent, noChatPrevious)
        } else {
            const roomIndex = chatRoomIdArr.indexOf(roomId)
            const payload = {
                roomId: roomId,
                idTempo: uuidv4(),
                userId: currentUser.userId,
                messageStatus: 'pending',
                messageType: 'sticker',
                messageContent: res.url,
            }
            await addMessageInChatStore(roomIndex, payload)
            const id = await saveMessageInDatabase(roomIndex, payload, chatRole)
            if (id) {
                payload.id = id
                socket.current.emit('clientSendMessage', payload)
            }
        }
    }
    async function handleSendGIF(object) {
        if (noChatPrevious) {
            const messageType = 'gif'
            const messageContent = JSON.stringify(object)
            handleSendFirstMessage(messageType, messageContent, noChatPrevious)
        } else {
            const roomIndex = chatRoomIdArr.indexOf(roomId)
            const payload = {
                roomId: roomId,
                idTempo: uuidv4(),
                userId: currentUser.userId,
                messageStatus: 'pending',
                messageType: 'gif',
                messageContent: JSON.stringify(object),
            }
            await addMessageInChatStore(roomIndex, payload)
            const id = await saveMessageInDatabase(roomIndex, payload, chatRole)
            if (id) {
                payload.id = id
                socket.current.emit('clientSendMessage', payload)
            }
        }
    }
    function handleMinimizeChatBox() {
        handleDeleteChatBox()
        const minimizeChatArr = JSON.parse(localStorage.getItem('minimizeChat'))
        let newMinimizeChatArr = minimizeChatArr ? minimizeChatArr : []
        if (noChatPrevious) {
            newMinimizeChatArr.push(noChatPrevious)
        } else {
            newMinimizeChatArr.push(roomId)
        }
        saveInReduxAndLocalStorage('minimizeChat', newMinimizeChatArr)
    }
    function handleDeleteChatBox() {
        const displayChatArr = JSON.parse(localStorage.getItem('displayChat'))
        let newDisplayChatArr = []
        if (noChatPrevious) {
            newDisplayChatArr = displayChatArr.filter(chat => chat.userId !== noChatPrevious.userId)
        } else {
            newDisplayChatArr = displayChatArr.filter(chat => chat !== roomId)
        }
        saveInReduxAndLocalStorage('displayChat', newDisplayChatArr)
        if (!isSendBlur.current) {
            handleSendUserBlurChatBox()
            isSendBlur.current = true
            isSendFocus.current = false
        }
    }
    function handleSelectEmoji(e) {
        const currentTextChat = $(`div[id="chat-content-${id}"]`).textContent
        $(`div[id="chat-content-${id}"]`).innerHTML = `${currentTextChat+e.native}`
        handleChangeTextChat()
        setTextChat(textChat ? textChat+e.native : e.native)
    }
    function EmojiPicker(props) {
        const ref = useRef()
      
        useEffect(() => {
            new Picker({ ...props, data, ref })
        }, [props])
      
        return <div ref={ref} />
    }
    function handleFocusChatBox() {
        if (chatRole === 'normal') {
            const hasMessageStatusReceived = chatDetail?.find(chat => chat.messageStatus === 'received' && chat.userId !== currentUser.userId )
            // console.log(hasMessageStatusReceived)
            if (hasMessageStatusReceived) {
                const payload = {
                    index: roomIndex,
                    userSeen: currentUser.userId,
                }
                dispatch(addUserSeenToAllMessage(payload))
                modifiedManyMessageStatusInRoomAtDatabase(roomId, chatRole, JSON.stringify([ currentUser.userId ]), partnerUserId)
            }
        }
    }
    function handleScrollMessageBody() {
        const messageBody = document.querySelector(`div[id="chat-box-content-${id}"]`)
        const conditionShowButtonScrollToEnd = messageBody.scrollHeight - 2*messageBody.offsetHeight - messageBody.scrollTop
        if (conditionShowButtonScrollToEnd > 0) {
            setDisplayScrollToEndButton(true)
        } else {
            setDisplayScrollToEndButton(false)
        }
    }

    return (
        <div id={"chat-box-"+id} className={"chat-box "+displayChatBox+themeMode}>
            <div className="chat-box-top">
                <div className="chat-box-user">
                    <div className="chat-box-user-left">
                        <div className="wrap-avatar-chat-box">
                            <img 
                                src={ avatarChatBox ? avatarChatBox : defaultAvatar } 
                                alt="" className="avatar-chat-box" 
                            />
                            {
                                partnerOnline && <div className="online-status"/>
                            }
                        </div>
                    </div>
                    <div className="chat-box-user-right">
                        <div className="chat-box-user-info">
                            <span className="display-user-name">{displayName}</span>
                            {
                                partnerOnline
                                    ?
                                    <span className="last-active-time">Đang hoạt động</span>
                                    : 
                                    partnerOnline === false
                                        ?
                                        <span className="last-active-time">Offline</span>
                                        :
                                        <span></span>
                            }   
                        </div>
                        <div className="chat-box-user-setting">
                            <FontAwesomeIcon icon={faAngleDown} />
                        </div>
                    </div>
                </div>
                <div className="chat-box-nav">
                    {
                        isFriend &&
                        <>
                            <span className="wrap-button-nav">
                                <div 
                                    role="button" tabIndex="0" aria-label="Gọi thoại" className="chat-box-btn voice-call"
                                    onClick={() => setToast(
                                        null, 
                                        'Tính năng này hiện chưa hoàn thiện, chúng tôi sẽ cập nhật sau.', 
                                        'notification', 
                                        3500, 
                                        themeMode === ' dark' ? true : false
                                    )}
                                >
                                    <FontAwesomeIcon id={"icon-chat-nav-"+id} icon={faPhone} className="icon-chat-box voice-call"/>
                                </div>
                            </span>
                            <span className="wrap-button-nav">
                                <div 
                                    role="button" tabIndex="0" aria-label="Video Call" className="chat-box-btn video-call"
                                    onClick={() => setToast(
                                        null, 
                                        'Tính năng này hiện chưa hoàn thiện, chúng tôi sẽ cập nhật sau.', 
                                        'notification', 
                                        3500, 
                                        themeMode === ' dark' ? true : false
                                    )}
                                >
                                    <FontAwesomeIcon id={"icon-chat-nav-"+id} icon={faVideo} className="icon-chat-box video-call"/>
                                </div>
                            </span>
                        </>
                    }
                    <span className="wrap-button-nav">
                        <div 
                            role="button" tabIndex="0" aria-label="Thu nhỏ chat" 
                            className="chat-box-btn minimize-chat-box" id={"minimize-chat-box-"+id}
                            onClick={handleMinimizeChatBox}
                        >
                            <FontAwesomeIcon id={"icon-chat-nav-"+id} icon={faMinus} className="icon-chat-box minimize-icon"/>
                        </div>
                    </span>
                    <span className="wrap-button-nav">
                        <div 
                            role="button" tabIndex="0" aria-label="Thoát" 
                            className="chat-box-btn exit" id={"delete-chat-box-"+id}
                            onClick={handleDeleteChatBox}
                        >
                            <FontAwesomeIcon id={"icon-chat-nav-"+id} icon={faXmark} className="icon-chat-box exit"/>
                        </div>
                    </span>
                </div>
            </div>
            <div 
                id={"chat-box-content-"+id} className="chat-box-center"
                onScroll={() => handleScrollMessageBody()}
            >
            {
                chatDetail?.map((chat, index) => { 
                    return (
                        <Message 
                            key={index} avatarChatBox={avatarChatBox} 
                            chatDetail={chat} role={chatRole} 
                            allChat={chatDetail} isLastMessage={chatDetail[(chatDetail.length - 1)]}
                        />
                    )
                })
            }
            {
                isTyping && <Message typing={true} avatarChatBox={avatarChatBox} />
            }
            </div>
            <div className="chat-box-bottom">
                {
                    displayScrollToEndButton &&
                    <span className="wrap-scroll-to-end-btn">
                        <div 
                            role="button" className="scroll-to-end-btn"
                            onClick={() => {
                                const messageBody = document.querySelector(`div[id="chat-box-content-${id}"]`)
                                messageBody.scrollTo({ behavior: 'smooth', top: messageBody.scrollHeight })
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowDown} className="scroll-to-end-icon"/>
                        </div>
                    </span>
                }
                <span 
                    id={"more-button-"+id} className="wrap-more-button hidden"
                >
                    <div 
                        role="button" tabIndex="0" aria-label="Thêm" 
                        className="more-button"
                    >
                        <FontAwesomeIcon 
                            id={"chat-box-icon-"+id} icon={faCirclePlus} 
                            className="button-chat-box-icon more-button-icon"
                        />
                    </div>
                </span>
                <div id={"left-button-group-"+id} className="left-button-group">
                    <span className="wrap-button-chat-box">
                        <input hidden type="file" id={"input-file-chat-box-"+id} onChange={(event) => handlePreviewFile(event)}/>
                        <div 
                            role="button" tabIndex="0" aria-label="Đính kèm file, hình ảnh" 
                            className="button-chat-box attack-file"
                            onClick={() => $(`input[id="input-file-chat-box-${id}"]`).click()}
                        >
                            <FontAwesomeIcon 
                                id={"chat-box-icon-"+id} icon={faFile} 
                                className="button-chat-box-icon file"
                            />
                            <FontAwesomeIcon 
                                id={"chat-box-icon-"+id} icon={faFileImage} 
                                className="button-chat-box-icon image"
                            />
                        </div>
                    </span>
                    <span className="wrap-button-chat-box">
                        <div 
                            role="button" tabIndex="0" aria-label="Chọn sticker" 
                            className="button-chat-box sticker" id={"sticker-button-"+id}
                        >
                            <div id={"sticker-btn-"+id} className="sticker-btn">
                                <FontAwesomeIcon
                                    id={"chat-box-icon-"+id} icon={faFaceSmile} 
                                    className="button-chat-box-icon sticker"
                                />
                            </div>
                        </div>
                    </span>
                    <span className="wrap-button-chat-box disable-select">
                        <div 
                            role="button" tabIndex="0" aria-label="Chọn GIF" 
                            className="button-chat-box gif" id={"gif-button-"+id}
                        >
                            <span id={"gif-icon-"+id} className="gif-icon">GIF</span>
                        </div>
                    </span>
                </div>
                <div className="test">
                    <div className="wrap-chat-box">
                        {
                            filePreview &&
                            <div className="wrap-preview-file">
                                <div className="wrap-file-message">
                                    <div className="wrap-file-message-icon">
                                        <FontAwesomeIcon icon={faFileLines} className="file-icon" />
                                    </div>
                                    <div className="wrap-file-message-name">
                                        <span className="file-message-name">{filePreview.name}</span>
                                    </div>
                                </div>
                                <span className="wrap-cancel-file-btn">
                                    <div 
                                        role="button" className="cancel-file-btn"
                                        onClick={() => {
                                            setFilePreview(null)
                                            if (!textChat) {
                                                shortTextChat()
                                            }
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faXmark} className="cancel-icon" />
                                    </div>
                                </span>
                            </div>
                        }
                        <div className="wrap-chat-layer1">
                            <div className="wrap-chat-layer2">
                                <div 
                                    contentEditable="true"
                                    id={"chat-content-"+id} className="chat-content"
                                    onInput={handleChangeTextChat}
                                    onKeyDown={handlePressKeyChatBox}
                                    onFocus={handleFocusChatBox}
                                >
                                </div>
                                <span 
                                    id={"placeholder-chat-box-"+id}
                                    className="placeholder-chat-box disable-select"
                                    onClick={() => $(`div[id="chat-content-${id}"]`).focus()}
                                >Aa</span>
                            </div>
                        </div>
                    </div>
                    <span className="wrap-button-chat-box">
                        <div 
                            role="button" tabIndex="0" aria-label="Chọn emote" 
                            className="button-chat-box emote" id={"emote-button-"+id}
                        >   
                            <FontAwesomeIcon 
                                id={"chat-box-icon-"+id} icon={faFaceSmile} 
                                className="button-chat-box-icon emote"
                            />
                        </div>
                    </span>
                </div>
                <div className="right-button-group">
                    <span className="wrap-button-chat-box">
                        <div 
                            id={"send-message-"+id}
                            role="button" tabIndex="0" aria-label="Gửi tin nhắn" 
                            className="button-chat-box send-message"
                            onClick={handleSendTextMessage}
                        >
                            <FontAwesomeIcon 
                                id={"chat-box-icon-"+id} icon={faPaperPlane} 
                                className="button-chat-box-icon send"
                            />
                        </div>
                    </span>
                    <span className="wrap-button-chat-box">
                        <div 
                            role="button" tabIndex="0" aria-label="Like" 
                            className="button-chat-box like"
                        >
                            <FontAwesomeIcon 
                                id={"chat-box-icon-"+id} icon={faThumbsUp} 
                                className="button-chat-box-icon like"
                            />
                        </div>
                    </span>
                </div>
                <div id={"emote-group-"+id} className="wrap-emote-group hidden">
                    <EmojiPicker 
                        navPosition="top" previewPosition="none" perLine="8" skin="2"
                        maxFrequentRows="2"
                        theme={themeMode === ' dark' ? 'dark' : 'light'} 
                        onEmojiSelect={handleSelectEmoji} searchPosition="none"
                    />
                </div>
                <div id={"gif-group-"+id} className="wrap-gif-group hidden">
                    <Grid 
                        width={260} columns={1} gutter={2} hideAttribution={true} 
                        fetchGifs={fetchGifs} onGifClick={(gif, e) => {
                            e.preventDefault()
                            handleSendGIF(gif)
                        }}
                    />
                </div>
                <div id={`sticker-group-`+id} className="wrap-sticker-group hidden">
                    {/* <SearchComponent 
                        preview={true}
                        params={{
                            apikey: `${process.env.REACT_APP_STIPOP_API_KEY}`,
                            userId: `a`,
                            limit: 50,
                        }}
                    /> */}
                    {/* <StoreComponent 
                        params={{
                            apikey: `${process.env.REACT_APP_STIPOP_API_KEY}`,
                            userId: `a`,
                        }}
                        downloadParams={{
                            isPurchase: 'N',
                        }}
                    /> */}
                    <PickerComponent 
                        size={{
                            width: 300,
                            height: 340,
                            imgSize: 100,
                        }}
                        menu={{
                            selectedLine:'3px solid rgb(32, 140, 235)',
                            arrowColor: 'rgb(32, 140, 235)',
                            imgSize: 36,
                            listCnt: 5,
                            backgroundColor:  themeMode === ' dark' ? '#323232' : '#fff'
                        }}
                        border={{
                            border: '2px solid rgb(32, 140, 235)',
                        }}
                        backgroundColor={ themeMode === ' dark' ? '#232323' : '#fff' }
                        loadingColor='rgb(32, 140, 235)'
                        shadow='none'
                        stickerClick={(url) => handleSendSticker(url)}
                        storeClick={(click) => console.log(click)}
                        params={{
                            apikey: `${process.env.REACT_APP_STIPOP_API_KEY}`,
                            userId: currentUser.userId,
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default memo(ChatBox);
