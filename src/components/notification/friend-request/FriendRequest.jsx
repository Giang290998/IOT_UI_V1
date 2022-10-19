import { memo, useState } from 'react';
import './friend_request.scss';
import defaultAvatar from '../../../assets/defaultAvatar.png';
import timeFormat from '../../../utils/timeFormat';
import notificationAPI from '../../../services/notificationAPI';
import { useSelector } from 'react-redux';

function FriendRequest({ info, currentUserId }) {
    const fullName = `${info.firstName+' '+info.lastName}`
    const requestAt = timeFormat.timeAgo(info.requestCreatedAt)
    const avatar = info.avatar ? info.avatar : defaultAvatar
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : '';
    const [isAccept, setIsAccept] = useState(false)

    async function handleAcceptFriendRequest() {
        try {
            const payload = {
                fromUser: info.userId, 
                toUser: currentUserId, 
                isAccept: true,
            }
            const res = await notificationAPI.responseFriendRequest(payload)
            if (res.data) {
                setIsAccept(true)
            }
        } catch (error) {
            throw new Error(error)
        }  
    }

    async function handleDeclineFriendRequest() {
        try {
            const payload = {
                fromUser: info.userId, 
                toUser: currentUserId, 
                isAccept: false,
            }
            const res = await notificationAPI.responseFriendRequest(payload)
            if (res.data) {
                
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    return (
        <div className={"friend-request"+themeMode}>
            <div className="friend-request-top">
                <div className="friend-request-top-left">
                    <div className="friend-request-wrap-avatar">
                        <img src={avatar} alt="" className="friend-request-avatar"/>
                    </div>
                    <div className="friend-request-create">
                        <p className="create-time">{requestAt}</p>
                    </div>
                </div>
                <div className="friend-request-top-right">
                    <p className="full-name">{fullName}</p>
                    <p className="live-in">Sống tại: Vĩnh Long</p>
                </div>
            </div>
            <div className="friend-request-bottom">
                <div className="friend-request-button-group">
                {
                    isAccept
                    ?
                    <span className="wrap-accept-btn">
                        <div className="btn btn--primary accept-btn">Đã đồng ý</div>
                    </span>
                    :
                    <>
                        <span className="wrap-decline-btn">
                            <div 
                                role="button" className="btn decline-btn"
                                onClick={handleDeclineFriendRequest}
                            >Xóa</div>
                        </span>
                        <span className="wrap-accept-btn">
                            <div 
                                role="button" className="btn btn--primary accept-btn"
                                onClick={handleAcceptFriendRequest}
                            >Đồng ý</div>
                        </span>
                    </>
                }
                </div>
            </div>
        </div>
    )
}

export default memo(FriendRequest);
