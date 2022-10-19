import { memo, useRef, useState } from 'react';
import './topbar.scss';
import defaultAvatar from '../../assets/defaultAvatar.png';
import logo from '../../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faRightFromBracket, faUserPlus, faEarthAmerica, faGear, 
    faHouse, faFilm, faMoon, faEllipsisVertical, faEllipsis 
} from '@fortawesome/free-solid-svg-icons'
import { faFaceFrownOpen } from '@fortawesome/free-regular-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import axiosClient from '../../services/axiosClient';
import { deleteAuthStore, modifiedThemeMode, setContent } from '../../redux/authSlice';
import { deleteChatStore } from '../../redux/chatSlice';
import { deleteCommentStore } from '../../redux/commentSlice';
import { deleteNotificationStore } from '../../redux/notificationSlice';
import { deletePostStore } from '../../redux/postSlice';
import MessageRoom from '../chat/message_room/MessageRoom';
import FriendRequest from '../notification/friend-request/FriendRequest';
import { setToast } from '../toast/ToastContainer';
import { CircularProgress } from 'react-cssfx-loading/lib';
import store from '../../redux/store';
import { createDisplayChatBox } from '../../utils/chatFunction';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

function Topbar({ socket, reRenderApp, isConnectedSocketServer }) {
    const $ = document.querySelector.bind(document)
    const $$ = document.querySelectorAll.bind(document)
    const navigate = useNavigate()
    const currentUser = store.getState().auth.login.user.userInformation
    const currentUserAvatar = useSelector(state => state.auth.login.user.userInformation.avatar)
    const chatRoomArr = currentUser.chatRoom ? JSON.parse(currentUser.chatRoom) : null 
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : '';
    const notification = useSelector(state => state.notification)
    const memberAvatarArr = useSelector(state => state.chat.chatRoomMemberAvatar) 
    const memberFullNameArr = useSelector(state => state.chat.chatRoomMemberFullName) 
    const memberUserIdArr = useSelector(state => state.chat.chatRoomUserId) 
    const detailChat = useSelector(state => state.chat.chatRoomDetail) 
    const friendRequest = notification.friendRequest ? notification.friendRequest : null
    const [displayGeneral, setDisplayGeneral] = useState(true)
    const [displayFriendRequest, setDisplayFriendRequest] = useState(false)
    const [messageUnread, setMessageUnread] = useState(0)
    const isExecuteControlClickNotificationNav = useRef(false)
    const isGetNumberMessageUnread = useRef(false)
    const isSortMessage = useRef(false)
    const URL = useRef(document.URL)
    const sort = useRef([])
    let chatRoomSort = useRef([])

    if (detailChat?.length > 0 && !isGetNumberMessageUnread.current) {
        setMessageUnread(getNumberUnreadMessage())
        isGetNumberMessageUnread.current = true
        if (detailChat.length > 1 && !isSortMessage.current) {
            isSortMessage.current = true
            let detailChatSort = detailChat.map(chat => chat)
            detailChatSort.sort((a,b) => new Date(b[b.length - 1].createdAt) - new Date(a[a.length - 1].createdAt))
            for (let i = 0; i < detailChatSort.length; i++) {
                for (let j = 0; j < detailChat.length; j++) {
                    if (detailChat[j][0] === detailChatSort[i][0]) {
                        sort.current.push(j)
                    }
                }
            }
            for (let k = 0; k < sort.current.length; k++) {
                chatRoomSort.current.push(chatRoomArr[sort.current[k]])
            }
        } else {
            // chatRoomSort = chatRoomArr
        }

    }

    useEffect(() => {
        const T = setInterval(() => {
            const wrapIcons = document.querySelectorAll('#lord-icon-custom')
            if (wrapIcons.length > 0) {
                wrapIcons.forEach((item) => {
                    const icon = item.shadowRoot.childNodes[1]
                    icon.setAttribute(
                        'style', 
                        themeMode === ' dark' ? '--lord-icon-primary-base: #e4e6eb': '--lord-icon-primary-base: #525252'
                    )
                })
            }
        }, 10)
    
        setTimeout(() => {
            clearInterval(T)
        }, 4000)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        customIcon()
        function customIcon() {
            const wrapIcons = document.querySelectorAll('#lord-icon-custom')
            wrapIcons.forEach((item) => {
                const icon = item.shadowRoot.childNodes[1]
                icon.setAttribute(
                    'style', 
                    themeMode === ' dark' ? '--lord-icon-primary-base: #e4e6eb': '--lord-icon-primary-base: #525252'
                )
            })
        }
    }, [themeMode])

    useEffect(() => {
        window.addEventListener('click', controlClickTopBar)
        return () => {
            window.removeEventListener('click', controlClickTopBar)
        }
        function controlClickTopBar(event) {
            controlSelectTopBarNav(event)
            controlClickCenterNav()
            const messageButton = $('div[id="message-btn"]')
            const messageTable = $('div[id="message-list"]')
            const settingButton = $('div[id="setting-btn"]')
            const settingTable = $('ul[id="setting-list"]')
            const notificationButton = $('div[id="notification-btn"]')
            const notificationTable = $('div[id="notification"]')
            const settingIcon = $('svg[id="setting-icon"]')
            const themeModeButton = $('li[id="theme-mode"]')
            if (messageButton.contains(event.target)) {
                setMessageUnread(0)
                if (messageTable.classList.contains('hidden')) {
                    messageTable.classList.remove('hidden')
                    // messageButton.classList.add('select')
                    const wrapIcon = (document.querySelectorAll('#lord-icon-custom'))[1]
                    const icon = wrapIcon.shadowRoot.childNodes[1]
                    icon.setAttribute('style', '--lord-icon-primary-base: #0088ff')
                } else {
                    messageTable.classList.add('hidden')
                    // messageButton.classList.remove('select')
                    const wrapIcon = (document.querySelectorAll('#lord-icon-custom'))[1]
                    const icon = wrapIcon.shadowRoot.childNodes[1]
                    icon.setAttribute(
                        'style', 
                        themeMode === ' dark' ? '--lord-icon-primary-base: #e4e6eb': '--lord-icon-primary-base: #525252'
                    )
                }
            } else {
                messageTable.classList.add('hidden')
                // messageButton.classList.remove('select')
                const wrapIcon = (document.querySelectorAll('#lord-icon-custom'))[1]
                const icon = wrapIcon.shadowRoot.childNodes[1]
                icon.setAttribute(
                    'style', 
                    themeMode === ' dark' ? '--lord-icon-primary-base: #e4e6eb': '--lord-icon-primary-base: #525252'
                )
            }
    
            if (settingButton.contains(event.target)) {
                if (settingTable.classList.contains('hidden')) {
                    settingTable.classList.remove('hidden')
                    settingIcon.classList.add('select')
                    settingButton.classList.add('select')
                } else {
                    settingTable.classList.add('hidden')
                    settingIcon.classList.remove('select')
                    settingButton.classList.remove('select')
                }
            } else {
                if (!themeModeButton.contains(event.target)) {
                    settingTable.classList.add('hidden')
                    settingIcon.classList.remove('select')
                    settingButton.classList.remove('select')
                }
            }
    
            if (notificationButton.contains(event.target)) {
                if (notificationTable.classList.contains('hidden')) {
                    notificationTable.classList.remove('hidden')
                    // notificationButton.classList.add('select')
                    const wrapIcon = (document.querySelectorAll('#lord-icon-custom'))[2]
                    const icon = wrapIcon.shadowRoot.childNodes[1]
                    icon.setAttribute('style', '--lord-icon-primary-base: #0088ff')
                    if(!isExecuteControlClickNotificationNav.current) {
                        controlClickNotificationNav()
                        isExecuteControlClickNotificationNav.current = true
                    }
                } else {
                    notificationTable.classList.add('hidden')
                    // notificationButton.classList.remove('select')
                    const wrapIcon = (document.querySelectorAll('#lord-icon-custom'))[2]
                    const icon = wrapIcon.shadowRoot.childNodes[1]
                    icon.setAttribute(
                        'style', 
                        themeMode === ' dark' ? '--lord-icon-primary-base: #e4e6eb': '--lord-icon-primary-base: #525252'
                    )
                }
            } else {
                if (!notificationTable.contains(event.target)) {
                    notificationTable.classList.add('hidden')
                    // notificationButton.classList.remove('select')
                    const wrapIcon = (document.querySelectorAll('#lord-icon-custom'))[2]
                    const icon = wrapIcon.shadowRoot.childNodes[1]
                    icon.setAttribute(
                        'style', 
                        themeMode === ' dark' ? '--lord-icon-primary-base: #e4e6eb': '--lord-icon-primary-base: #525252'
                    )
                }
            }
        }
        function controlClickCenterNav() {
            const tabs = $$('li[id="top-bar-center-item"]')
            tabs.forEach((tab, index) => {
                tab.addEventListener('click', () => {
                    switch (index) {
                        case 0:
                            store.dispatch(setContent('post'))
                            break;
                        case 1:
                            store.dispatch(setContent('short-video'))
                            break;
                        default:
                            break;
                    }
                    $('.top-bar-center-item.active')?.classList.remove('active')
                    tabs[index].classList.add('active')
                })
            })
        }
        function controlSelectTopBarNav(event) {
            if (document.URL !== URL.current) {
                if(document.URL === process.env.REACT_APP_BASE_URL) {
                    let clickCenterNav = false
                    const tabs = $$('li[id="top-bar-center-item"]')
                    tabs.forEach(tab => {
                        if (tab.contains(event.target)) {
                            clickCenterNav = true
                            tab.classList.add('active')
                        }
                    })
                    if (!clickCenterNav) {
                        tabs[0].classList.add('active')
                    }
                } else {
                    $('.top-bar-center-item.active')?.classList.remove('active')
                }
                URL.current = document.URL
            }
        }
        function controlClickNotificationNav() {
            const title = $('#notification-title')
            const tabs = $$('.btn.notification')
            const tabActive = $('.btn.notification.active')
            const line = $('#nav-notification-line')
            line.style.left = tabActive.offsetLeft + 'px'
            line.style.width = tabActive.offsetWidth + 'px'
            tabs.forEach((tab, index) => {
                tab.addEventListener('click', () => {
                    switch (index) {
                        case 0:
                            setDisplayGeneral(true)
                            setDisplayFriendRequest(false)
                            title.innerText = 'Thông báo chung'
                            break;
                        case 1:
                            setDisplayGeneral(false)
                            setDisplayFriendRequest(true)
                            title.innerText = 'Lời mời kết bạn'
                            break;
                        default:
                            break;
                    }
                    $('.btn.notification.active').classList.remove('active')
                    tabs[index].classList.add('active')
                    line.style.left = tabs[index].offsetLeft + 'px'
                    line.style.width = tabs[index].offsetWidth + 'px'
                })
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[themeMode])
    
    function handleLogOut() {

        /*--- Delete Cookie ---*/
        Cookies.remove('refreshToken',
            // { path: '', domain: '.yourDomain.com' }
        )
        /*--- Delete local storage ---*/
        window.localStorage.clear()

        /*--- Delete access token in headers ---*/
        delete axiosClient.defaults.headers["accessToken"]

        /*--- Delete redux store ---*/
        store.dispatch(deleteAuthStore())
        store.dispatch(deleteChatStore())
        store.dispatch(deleteCommentStore())
        store.dispatch(deleteNotificationStore())
        store.dispatch(deletePostStore())

        /*--- Disconnect socket server ---*/
        socket.current.disconnect()
        isConnectedSocketServer.current = false

        /*--- Redirect login page ---*/
        reRenderApp()
    }

    function handlePopUpChatBox(id) {
        createDisplayChatBox(null, null, null, id)
    }
    function getNumberUnreadMessage() {
        let unreadMessage = 0
        if (detailChat) {
            for (let i = 0; i < detailChat.length; i++) {
                let hasUnreadMessage = false
                for (let j = 0; j < detailChat[i].length; j++) {
                    if (detailChat[i][j].messageStatus === 'received' && detailChat[i][j].userId !== currentUser.userId) {
                        hasUnreadMessage = true
                    }
                }
                if (hasUnreadMessage) {
                    unreadMessage += 1
                }
            }
        }
        return unreadMessage
    }

    return (
        <div className={"wrapper-top"+themeMode}>
            <div className="topbar-wrapper disable-select">
                <div className="col l-3 m-2 s-1 topbar-left">
                    <Link to='/' className="logo-name">GSocial</Link>
                    <Link to='/' className='logo-img'>
                        <img src={logo} alt="logo" className="logo-image" />
                    </Link>
                </div>
                <div className="col l-6 m-7 s-10 topbar-center">
                    <div className="wrap-top-bar-center-nav-list">
                        <ul className="top-bar-center-nav-list">
                            <li role="button" className="btn-circle top-bar-center-item-small-scale left-bar">
                                <FontAwesomeIcon icon={faEllipsisVertical} className="top-bar-center-item-small-scale-icon" />
                            </li>
                            <li role="button" className="btn-circle top-bar-center-item-small-scale center">
                                <FontAwesomeIcon icon={faEllipsis} className="top-bar-center-item-small-scale-icon" />
                            </li>
                            <li role="button" className="btn-circle top-bar-center-item-small-scale right-bar">
                                <FontAwesomeIcon icon={faEllipsisVertical} className="top-bar-center-item-small-scale-icon" />
                            </li>
                            <li 
                                id="top-bar-center-item" 
                                className="btn top-bar-center-item active"
                                onClick={() => navigate('/')}
                            >
                                <FontAwesomeIcon icon={faHouse} className="top-bar-nav-icon"/>
                            </li>
                            <li 
                                id="top-bar-center-item"
                                className="btn top-bar-center-item"
                                onClick={() => {
                                    navigate('/')
                                    setToast(
                                        null, 
                                        'Tính năng này hiện chưa hoàn thiện, chúng tôi sẽ cập nhật sau.', 
                                        'notification', 
                                        3500, 
                                        themeMode === ' dark' ? true : false
                                    )}
                                }
                            >
                                <FontAwesomeIcon icon={faFilm} className="top-bar-nav-icon"/>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="col l-3 m-3 s-1 topbar-right">
                    <div 
                        className="btn-circle topbar__friend-request"
                        onClick={() => setToast(
                            null, 
                            'Tính năng này hiện chưa hoàn thiện, chúng tôi sẽ cập nhật sau.', 
                            'notification', 
                            3500, 
                            themeMode === ' dark' ? true : false
                        )}
                    >
                        <div className="wrapper-icon disable-select">
                            <lord-icon
                                id="lord-icon-custom"
                                src="https://cdn.lordicon.com/mrdiiocb.json"
                                trigger="click"
                                style={{width:26, height:26}}
                            >
                            </lord-icon>
                        </div>
                    </div>
                    <div className="btn-circle topbar__message">
                        <div 
                            id="message-btn" className="wrapper-icon disable-select"
                        >
                            <lord-icon
                                id="lord-icon-custom"
                                className="lord-icon-custom message"
                                src="https://cdn.lordicon.com/pkmkagva.json"
                                trigger="click"
                                style={{width:27, height:27}}
                            >
                            </lord-icon>
                            {
                                (messageUnread > 0)
                                &&
                                <span className="topbar__not-seen disable-select">
                                    <p className="not-seen-number">{messageUnread}</p>
                                </span>
                            }
                        </div>
                    </div>
                    <div className="btn-circle topbar__notification">
                        <div id="notification-btn" className="wrapper-icon disable-select">
                            <lord-icon
                                id="lord-icon-custom"
                                className="lord-icon-custom notification"
                                src="https://cdn.lordicon.com/msetysan.json"
                                trigger="click"
                                style={{width:28, height:28}}
                            >
                            </lord-icon>
                            {/* <span className="topbar__not-seen disable-select">
                                <p className="not-seen-number">99</p>
                            </span> */}
                        </div>
                    </div>
                    <div className="btn-circle topbar__user-setting">
                        <div id="setting-btn" className="wrapper-icon disable-select">
                            <img src={currentUserAvatar ? currentUserAvatar : defaultAvatar} alt="" className="current-user-avatar" />
                            <FontAwesomeIcon icon={faGear} className="user-setting-icon" id="setting-icon"/>
                        </div>
                    </div>
                    <ul id="setting-list" className="setting-list hidden">
                        <li  className="setting-item" onClick={() => navigate(`/${currentUser.userId}`)}>
                            <img src={currentUserAvatar ? currentUserAvatar : defaultAvatar} alt="" className="user-avatar" />
                            <span className="user-full-name">{currentUser.firstName+" "+ currentUser.lastName}</span>
                        </li>
                        <li className="setting-item" id="theme-mode">
                            <div className="wrapper-setting-icon">
                                <FontAwesomeIcon icon={faMoon} className="setting-icon mode"/>
                            </div>
                            <span className="setting-desc">Chế độ tối</span>
                            <div className="wrap-toggle-btn-mode">
                                <div className="container">
                                    <label className="switch">
                                        <input 
                                            id="toggle" type="checkbox" 
                                            checked={themeMode === ' dark' ? true : false}
                                            onChange={(event) => {
                                                if (event.target.checked) {
                                                    store.dispatch(modifiedThemeMode('dark'))
                                                    localStorage.setItem('themeMode', 'dark')
                                                } else {
                                                    store.dispatch(modifiedThemeMode('light'))
                                                    localStorage.setItem('themeMode', 'light')
                                                }
                                            }}
                                        />
                                        <span id="slider" className="slider"></span>
                                    </label>
                                </div>
                            </div>
                        </li>
                        <li className="setting-item" onClick={handleLogOut}>
                            <div className="wrapper-setting-icon">
                                <FontAwesomeIcon icon={faRightFromBracket} className="setting-icon logout"/>
                            </div>
                            <span className="setting-desc">Đăng xuất</span>
                        </li>
                    </ul>
                    <div id="message-list" className="message-list-wrapper hidden">
                        <div className="wrapper-chat-top">
                            <div className="message-list-header">
                                <span className="message-list-title disable-select">Tin nhắn</span>
                            </div>
                            {/* <input type="text" className="message-search"/> */}
                        </div>
                        <ul className="message-list">
                        {   
                            chatRoomArr && !(memberAvatarArr && memberFullNameArr && detailChat)
                                ? 
                                <li className="wrapper-spin">
                                    <CircularProgress width={60} height={60} style={{margin: 6}}/>
                                </li>
                                : chatRoomArr && (memberAvatarArr && memberFullNameArr && detailChat)
                                    ? 
                                        chatRoomSort.current.length > 0
                                        ?
                                        chatRoomSort.current.map((roomId, index) => { 
                                            return (
                                                <li 
                                                    key={roomId} className="message-item" 
                                                    onClick={() => handlePopUpChatBox(roomId)}
                                                >
                                                    <MessageRoom 
                                                        roomId={roomId} serialId={index} 
                                                        lastMessage={detailChat[sort.current[index]][(detailChat[sort.current[index]].length - 1)]}
                                                        memberAvatarArr={memberAvatarArr[sort.current[index]]}
                                                        memberFullNameArr={memberFullNameArr[sort.current[index]]}
                                                        memberUserIdArr={memberUserIdArr[sort.current[index]]}
                                                    />
                                                </li>
                                            )
                                        })
                                        :
                                        chatRoomArr.map((roomId, index) => { 
                                            return (
                                                <li 
                                                    key={roomId} className="message-item" 
                                                    onClick={() => handlePopUpChatBox(roomId)}
                                                >
                                                    <MessageRoom 
                                                        roomId={roomId} serialId={index} 
                                                        lastMessage={detailChat[index][(detailChat[index].length - 1)]}
                                                        memberAvatarArr={memberAvatarArr[index]}
                                                        memberFullNameArr={memberFullNameArr[index]}
                                                        memberUserIdArr={memberUserIdArr[index]}
                                                    />
                                                </li>
                                            )
                                        })
                                    :
                                    <li className="no-conversation">
                                        <div className="no-conversation-img">
                                            <FontAwesomeIcon icon={faFaceFrownOpen} className="face"/>
                                        </div>
                                        <span className="no-conversation-desc">Không có cuộc trò chuyện nào!</span>
                                    </li>
                        }
                        </ul>
                    </div>
                    <div 
                        id="notification" className="wrap-notification-list hidden"
                    >
                        <div className="notification-top">
                            <span id="notification-title" className="notification-title">Thông báo chung</span>
                        </div>
                        <div className="notification-nav">
                            <div className="btn notification general active">
                                <FontAwesomeIcon icon={faEarthAmerica} className="notification-icon"/>
                            </div>
                            <div className="btn notification friend-request">
                                <FontAwesomeIcon icon={faUserPlus} className="notification-icon"/>
                            </div>
                            <div id="nav-notification-line" className="notification-line" />
                        </div>
                        <div id="notification-content" className="wrap-notification-item">
                        {
                            displayGeneral &&
                            <h3 className="no-notification">Không có thông báo.</h3>
                            // <ul className="notification-general-list">
                            //     <li className="notification-general-item">general-list</li>
                            // </ul>
                        }
                        {
                            displayFriendRequest &&
                            <div className="wrap-notification-friend-request-list">
                            {
                                (friendRequest.length > 0)
                                ? 
                                <ul className="notification-friend-request-list">
                                {
                                    friendRequest.map(info => {
                                        return (
                                            <li key={info.id} className="notification-friend-request-item">
                                                <FriendRequest info={info} currentUserId={currentUser.userId}/>
                                            </li>
                                        )
                                    })
                                }
                                </ul>
                                :
                                <h3 className="notification-friend-request-empty">Không có lời mời.</h3>
                            }
                            </div>
                        }
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    )
    
}

export default memo(Topbar);
