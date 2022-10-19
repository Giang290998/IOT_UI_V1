import { memo } from 'react';
import './profile_friends.scss';
import defaultAvatar from '../../../assets/defaultAvatar.png';
import Footer from '../../footer-information/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

function ProfileFriends({ allFriendInfo }) {
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : '';
    return (
        <div className={"wrap-profile-friends"+themeMode}>
            <div className="grid profile-friends">
                <div className="row profile-friends-top">
                    <span className="col l-3 profile-friends-top-title">Bạn bè</span>
                    <div className="col l-9 profile-friends-top-search">
                        <div className="wrap-profile-friends-top-search-input">
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="profile-friends-top-search-icon"/>
                            <input type="text" className="profile-friends-top-search-input" placeholder="Tìm kiếm"/>
                        </div>
                    </div>
                </div>
                <div className="row profile-friends-contain">
                {
                    allFriendInfo
                    ?
                    allFriendInfo.map(friend => 
                        <div className="col l-5 profile-friends-item">
                            <img src={friend.avatar ? friend.avatar : defaultAvatar} alt="" className="profile-friends-img"/>
                            <span className="profile-friend-fullname">{friend.firstName+' '+friend.lastName}</span>
                        </div>
                    )
                    :
                    <h3 className="profile-friends-empty">Không có bạn bè.</h3>
                }
                </div>
            </div>
            <Footer />
        </div>
    )
}   

export default memo(ProfileFriends);
