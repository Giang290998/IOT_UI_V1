import { memo, useState, useEffect } from 'react';
import './message_room.scss';
import defaultAvatar from '../../../assets/defaultAvatar.png';
import timeFormat from '../../../utils/timeFormat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation as failed, faCircleCheck as received } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck as sent, faCircle as pending } from '@fortawesome/free-regular-svg-icons';
import { useSelector } from 'react-redux';

function MessageRoom({ roomId, serialId, lastMessage, memberAvatarArr, memberFullNameArr, memberUserIdArr }) {
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : ''
    const currentUser = useSelector(state => state.auth.login.user.userInformation)
    const friendListOnline = useSelector(state => state.auth.friendOnline)
    const isYou = lastMessage.userId === currentUser.userId ? true : false
    const role = memberFullNameArr.length === 2 ? 'normal' : 'group'
    const currentUserFullName = `${currentUser.firstName+' '+currentUser.lastName}`
    const displayName = getDisplayName(memberFullNameArr, currentUserFullName)
    const displayAvatar = getDisplayAvatar(memberAvatarArr, currentUser.avatar)
    const timeAgo = timeFormat.timeAgo(lastMessage.createdAt)
    const [lastMessageTime, setLastMessageTime] = useState(timeAgo)
    const lastMessageType = lastMessage.messageType
    const lastMessageContent = lastMessage.messageContent
    const lastMessageStatus = getMessageStatus()
    const partnerUserId = (memberUserIdArr.length === 2 && memberUserIdArr[0] === currentUser.userId) 
        ? memberUserIdArr[1] 
        : memberUserIdArr[0]
    const partnerOnline = (role === 'normal' && friendListOnline.includes(partnerUserId)) ? true : false

    useEffect(() => {
        setLastMessageTime(timeFormat.timeAgo(lastMessage.createdAt))
        const T = setInterval(() => {
            setLastMessageTime(timeFormat.timeAgo(lastMessage.createdAt))
        }, 60*1000)
        return () => {
            clearInterval(T)
        }
    }, [lastMessage])

    function getDisplayName(memberFullNameArr, currentUserFullName) {
        if (memberFullNameArr.length === 2) {
            return memberFullNameArr.find(fullName => fullName !== currentUserFullName) 
        } else {
            
        }
    }
    function getDisplayAvatar(memberAvatarArr, currentUserAvatar) {
        if (memberAvatarArr.length === 2) {
            return memberAvatarArr.find(avatar => avatar !== currentUserAvatar) 
        } else {
            
        }
    }
    function getMessageStatus() {
        if (memberUserIdArr.length === 2) {
            switch (lastMessage.messageStatus) {
                case 'pending':
                    return 'pending'
                case 'sent':
                    if (lastMessage.userId === currentUser.userId) {
                        return 'sent'
                    }
                    return 'unread'
                case 'received':
                    if (lastMessage.userId === currentUser.userId) {
                        return 'received'
                    }
                    return 'unread'
                case 'failed':
                    return 'failed'
                default:
                    if (lastMessage.messageStatus.includes(currentUser.userId) && !isYou) {
                        return null
                    }
                    return 'seen'
            }
        } else {
            return null
        }
    }
 
    return (
        <div className={"message-room"+themeMode}>
            <div className="message-room-left">
                <div className="wrapper-avatar">
                    <img alt="" className="avatar-user" src={displayAvatar ? displayAvatar : defaultAvatar}/>
                    {
                        partnerOnline && <div className="online-status"/>
                    }
                </div>
            </div>
            <div className="message-room-center">
                <span className="receiver-full-name">{displayName}</span>
                <div className={"wrapper-last-message "+lastMessageStatus}>
                    {
                        lastMessageType === 'text'
                        &&
                        <span className="last-message">{isYou ? `Bạn: ${lastMessageContent}`: `${lastMessageContent}`}&nbsp;</span>
                    }
                    {
                        lastMessageType === 'sticker'
                        &&
                        <span className="last-message">{isYou ? 'Bạn: ': ''}Đã gửi một nhãn dán&nbsp;</span>
                    }
                    {
                        lastMessageType === 'image'
                        &&
                        <span className="last-message">{isYou ? 'Bạn: ': ''}Đã gửi một ảnh&nbsp;</span>
                    }
                    {
                        lastMessageType === 'gif'
                        &&
                        <span className="last-message">{isYou ? 'Bạn: ': ''}Đã gửi một GIF&nbsp;</span>
                    }
                    <span className="dot">&nbsp;.&nbsp;</span>
                    <span className="last-message-time">{lastMessageTime}</span> 
                </div>
            </div>
            <div className="message-room-right">
                {
                    lastMessageStatus === 'unread' && <div className="last-message-status-unread"/> 
                }
                {
                    lastMessageStatus === 'pending'
                    &&
                    <FontAwesomeIcon icon={pending} className="last-message-status-icon"/>
                }
                {
                    lastMessageStatus === 'sent'
                    &&
                    <FontAwesomeIcon icon={sent} className="last-message-status-icon"/>
                }
                {
                    lastMessageStatus === 'received'
                    &&
                    <FontAwesomeIcon icon={received} className="last-message-status-icon"/>
                }
                {
                    lastMessageStatus === 'failed'
                    &&
                    <FontAwesomeIcon icon={failed} className="last-message-status-icon failed"/>
                }
                {
                    lastMessageStatus === 'seen'
                    &&
                    <img src={displayAvatar} alt="last-message-status-seen" className="last-message-status-seen" />
                }
            </div>
        </div>
    )
}

export default memo(MessageRoom);
