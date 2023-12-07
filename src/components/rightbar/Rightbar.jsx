import { memo } from 'react';
import './rightbar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faLinkSlash, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import UserOnline from '../user-online/UserOnline';
import ImgDesc from '../img-desc/ImgDesc';
import { useSelector } from 'react-redux';
import { faFaceFrownOpen } from '@fortawesome/free-regular-svg-icons';
import { createDisplayChatBox } from '../../utils/chatFunction';

function Rightbar() {
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : '';
    const chatRoom = useSelector(state => state.auth.login.user?.userInformation?.chatRoom)
    const chatRoomIdArr = chatRoom ? JSON.parse(chatRoom) : null
    const friendInfo = useSelector(state => state.auth.friendInfo)
    const friendOnline = useSelector(state => state.auth.friendOnline)
    const chatRoomUserId = useSelector(state => state.chat.chatRoomUserId)

    function handlePopUpNormalChat(userId, fullName, avatar) {
        let index = null
        if (chatRoomUserId) {
            for (let i = 0; i < chatRoomUserId.length; i++) {
                if (chatRoomUserId[i].length === 2 && chatRoomUserId[i].includes(userId)) {
                    index = i
                }
            }
            if (index !== null) {
                createDisplayChatBox(null, null, null, chatRoomIdArr[index])
            } else {
                createDisplayChatBox(userId, avatar, fullName)
            }
        } else {
            createDisplayChatBox(userId, avatar, fullName)
        }
    }

    return (
        <div className={"rightbar-wrapper" + themeMode}>
            <div className="your-page-wrapper">
                <div className="your-page-top">
                    <span className="your-page-title">Trang của bạn</span>
                    <div className="extra-wrapper-icon">
                        <FontAwesomeIcon icon={faEllipsis} className="dot-icon" />
                    </div>
                </div>
                <div className="your-page-contain">
                    <ImgDesc desc="Page này của tui!" />
                </div>
            </div>
            <div className="your-friend-wrapper">
                <div className="your-friend-top">
                    <span className="your-friend-title">Người liên hệ</span>
                    {/* <div className="extra-wrapper-icon">
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="dot-icon"/>
                    </div> */}
                    <div className="extra-wrapper-icon">
                        <FontAwesomeIcon icon={faEllipsis} className="dot-icon" />
                    </div>
                </div>
                <div className="your-friend-contain">
                    {
                        (friendOnline.length > 0)
                            ?
                            friendOnline.map(friend => {
                                const info = friendInfo.find(frOnline => friend === frOnline.userId)
                                return (
                                    <div
                                        key={info.id}
                                        className="wrap-user-online"
                                        onClick={() => handlePopUpNormalChat(info.userId, info.firstName + " " + info.lastName, info.avatar)}
                                    >
                                        <UserOnline desc={info.firstName + " " + info.lastName} img={info.avatar} />
                                    </div>
                                )
                            })
                            :
                            friendInfo
                                ?
                                <div className="wrap-no-friend-online">
                                    <FontAwesomeIcon icon={faLinkSlash} className="no-friend-icon" />
                                    <span className="no-friend-online">Hiện không có bạn bè online.</span>
                                </div>
                                :
                                <div className="wrap-no-friend-online">
                                    <FontAwesomeIcon icon={faFaceFrownOpen} className="no-friend-icon" />
                                    <span className="no-friend-online">Bạn không có bạn bè, hãy kết bạn để giao lưu, chia sẻ!</span>
                                </div>
                    }
                </div>
            </div>
            <div className="group-chat-wrapper">
                <div className="group-chat-top">
                    <span className="group-chat-title">Trò chuyện nhóm</span>
                    <div className="extra-wrapper-icon">
                        <FontAwesomeIcon icon={faEllipsis} className="dot-icon" />
                    </div>
                </div>
                <div className="group-chat-contain">
                    <ImgDesc desc="Nhóm Sugar Daddy" />
                    <ImgDesc desc="Nhóm chăn máy bay." />
                    <ImgDesc desc="Tạo nhóm mới" img="https://cdn3.iconfinder.com/data/icons/eightyshades/512/14_Add-512.png" className="button-create" />
                </div>
            </div>
        </div>


    );
}

export default memo(Rightbar);
