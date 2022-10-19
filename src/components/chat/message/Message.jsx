import { memo } from 'react';
import './message.scss';
import defaultAvatar from '../../../assets/defaultAvatar.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faCircle, faCircleExclamation, faCircleCheck, faFileLines } from '@fortawesome/free-solid-svg-icons';
import { Gif } from '@giphy/react-components';
import { faCircleCheck as successIcon, faCircle as nullStatus } from '@fortawesome/free-regular-svg-icons';
import { useSelector } from 'react-redux/es/exports';

function Message({ role, chatDetail, avatarChatBox, typing, allChat, isLastMessage }) {
    const currentUser = useSelector(state => state.auth.login.user.userInformation);
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : '';
    const currentUserId = currentUser.userId;
    const avatarDisplay = avatarChatBox ? avatarChatBox : defaultAvatar;
    let id = null
    let ownClass = '';
    let isLastMessageSeen = false;
    let isOwn = false;
    let messageSeen = null;
    let messageStatus = null;
    let seenStatus = null;
    let textMessage = null;
    let stickerURL = null;
    let modalGIF = null;
    let fileMessage = null;

    if (!typing) {
        id = chatDetail.id ? chatDetail.id : chatDetail.idTempo
        messageStatus = chatDetail.messageStatus
        messageSeen = allChat.filter(message => isSeen(message.messageStatus))
        if (messageSeen && messageSeen[(messageSeen.length - 1)] === chatDetail) {
            isLastMessageSeen = true
        }
        if (isSeen(messageStatus)) {
            seenStatus = JSON.parse(messageStatus)
        }
        isOwn = chatDetail.userId === currentUserId ? true : false;
        ownClass = (chatDetail.userId === currentUserId ? true : false) ? ' own' : '';
        switch (chatDetail.messageType) {
            case 'text':
                textMessage = chatDetail.messageContent
                break;
            case 'sticker':
                stickerURL = chatDetail.messageContent
                break;
            case 'gif':
                modalGIF = JSON.parse(chatDetail.messageContent)
                break;
            case 'file':
                fileMessage = typeof chatDetail.messageContent === 'string' 
                    ? JSON.parse(chatDetail.messageContent) 
                    : chatDetail.messageContent
                break;
            default:
                break;
        }
    }
    function isSeen(status) {
        if (status !== 'pending' && status !== 'received' && status !== 'failed' && status !== 'sent') {
            return true
        }
        return false
    }

    return (
        <div className={"wrap-message"+ownClass+themeMode}>
        {
            !isOwn && 
            <div className="wrap-avatar-user">
                <img src={avatarDisplay} alt="" className="avatar-user" />
            </div>
        }
        {
            typing
            ? 
            <div className="typing-message">
                <FontAwesomeIcon icon={faCircle} className="typing-icon"/>
                <FontAwesomeIcon icon={faCircle} className="typing-icon"/>
                <FontAwesomeIcon icon={faCircle} className="typing-icon"/>
            </div>
            :
            <>  
                {
                    (isOwn && role === 'normal') &&
                    <div className="message-status-group disable-select">
                        {   
                            (messageStatus === 'sent') &&
                            <div className="message-status success">
                                <FontAwesomeIcon icon={successIcon} className="status-message-icon"/>
                            </div>
                        }
                        {
                            (messageStatus === 'received') &&
                            <div className="message-status realtime">
                                <FontAwesomeIcon icon={faCircleCheck} className="status-message-icon"/>
                            </div>
                        }
                        {
                            (messageStatus === 'pending') &&
                            <div className="message-status pending">
                                <FontAwesomeIcon icon={nullStatus} className="status-message-icon"/>
                            </div>
                        }
                        {
                            (messageStatus === 'failed') &&
                            <div className="message-status failed">
                                <FontAwesomeIcon icon={faCircleExclamation} className="status-message-icon failed" />
                            </div>
                        }
                        {
                            (seenStatus && isLastMessageSeen && isLastMessage) &&
                            <div className="message-status seen">
                                <img src={avatarDisplay} alt="" className="status-message-icon avatar-user" />
                            </div>
                        }
                    </div>
                }
                <div className="message-content">
                {
                    textMessage && <div 
                        className="wrap-text-message"
                    >
                        <p className="text-message">{textMessage}</p>
                    </div>
                }
                {
                    stickerURL && <img src={stickerURL} alt="" className="sticker disable-select"/>
                }
                {
                    modalGIF && 
                    <Gif 
                        gif={modalGIF} width={180} hideAttribution={true}
                        onGifClick={(gif, e) => {
                            e.preventDefault()
                        }}
                    />
                }
                {
                    fileMessage &&
                    <div 
                        className="wrap-file-message"
                        onClick={() => {
                            const downloadButton = document.querySelector(`a[id="message-${id}"]`)
                            if (downloadButton) {
                                downloadButton.click()
                            }
                        }}
                    >   
                        {
                            (chatDetail.userId !== currentUserId) &&
                            <a 
                                id={"message-"+id} href={fileMessage.content} 
                                hidden download={`${fileMessage.name}`}
                            >Download</a>
                        }
                        <div className="wrap-file-message-icon">
                            <FontAwesomeIcon icon={faFileLines} className="file-icon" />
                        </div>
                        <div className="wrap-file-message-name">
                            <span className="file-message-name">{fileMessage.name}</span>
                        </div>
                    </div>
                }
                </div>
                <div className="button-message disable-select">
                    <FontAwesomeIcon icon={faEllipsisVertical} className="more-interact-icon" />
                </div>
            </>
        }   
        </div>
    )
}

export default memo(Message);
