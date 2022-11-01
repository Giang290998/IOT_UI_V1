import { memo, useEffect, useState } from 'react';
import './profile_posted.scss';
import defaultAvatar from '../../../assets/defaultAvatar.png';
import CreatePostForm from '../../create-post-form/CreatePostForm';
import Post from '../../post/Post';
import Footer from '../../footer-information/Footer';
import PostSkeleton from '../../skeleton/post/PostSkeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseChimneyWindow, faLocationDot, faGraduationCap, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import postAPI from '../../../services/postAPI';
import { useNavigate } from 'react-router-dom';

function ProfilePosted({ friendArr, allFriendInfo, userInfo }) {
    const navigate = useNavigate()
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : '';
    const currentUser = useSelector(state => state.auth.login.user.userInformation);
    const [posts, setPosts] = useState();
    const profileUser = useParams();
    const allImage = userInfo.image ? JSON.parse(userInfo.image) : null;
    let imageDisplay = []
    let friendDisplay = []

    if (allFriendInfo?.length > 9) {
        for (let i = 0; i < 10; i++) {
            friendDisplay.push(allFriendInfo[i])
        }
    } else {
        friendDisplay = allFriendInfo
    }
    if (allImage?.length > 9) {
        for (let i = 0; i < 10; i++) {
            imageDisplay.push(allImage[i])
        }
    } else {
        imageDisplay = allImage
    }

    useEffect(() => {
        getAllPostProfile()   
        async function getAllPostProfile() {
            const res = await postAPI.getAllPostProfile(profileUser.userId)
            const posts = res.data.posts
            if (res.data.errCode === 0) {
                if (currentUser.userId === profileUser.userId) {
                    setPosts(posts)
                } else {
                    if (friendArr?.includes(currentUser.userId)) {
                        const newPosts = posts.filter(post => post.mode !== 'private')
                        setPosts(newPosts)
                    } else {
                        const newPosts = posts.filter(post => post.mode === 'public')
                        setPosts(newPosts)
                    }
                }
            } 
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    
    posts?.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    return (
        <div className={"row wrap-profile-overview"+themeMode}>
            <div className="col l-5 m-12 s-10 profile-info" id="profile-info-height">
                <div className="introduce">
                    <span className="introduce-title">Giới thiệu</span>
                    {/* <div className="introduce-info">
                        <div className="introduce-icon-wrapper">
                            <FontAwesomeIcon icon={faGraduationCap} className="introduce-icon"/>
                        </div>
                        <span>Đang học tại&nbsp;</span>
                        <span className="introduce-title">Đại học Bách Khoa TP.HCM</span>
                    </div>
                    <div className="introduce-info">
                        <div className="introduce-icon-wrapper">
                            <FontAwesomeIcon icon={faGraduationCap} className="introduce-icon"/>
                        </div>
                        <span>Đã học tại&nbsp;</span>
                        <span className="introduce-title">THPT Mang Thít</span>
                    </div>
                    <div className="introduce-info">
                        <div className="introduce-icon-wrapper">
                            <FontAwesomeIcon icon={faBriefcase} className="introduce-icon"/>
                        </div>
                        <span>Đang làm việc tại&nbsp;</span>
                        <span className="introduce-title">Công ty Gì Gì Đó</span>
                    </div> */}
                    <div className="introduce-info">
                        <div className="introduce-icon-wrapper">
                            <FontAwesomeIcon icon={faHouseChimneyWindow} className="introduce-icon"/>
                        </div>
                        <span>Sống tại&nbsp;</span>
                        <span className="introduce-title">Thành phố Hồ Chí Minh</span>
                    </div>
                    <div className="introduce-info">
                        <div className="introduce-icon-wrapper">
                            <FontAwesomeIcon icon={faLocationDot} className="introduce-icon"/>
                        </div>
                        <span>Đến từ&nbsp;</span>
                        <span className="introduce-title">Vĩnh Long</span>
                    </div>
                </div>
                <div className="img-outstanding">
                    <span className="img-outstanding-title">Ảnh</span>
                    <div className="img-outstanding-content">
                    {
                        imageDisplay
                        ?
                        imageDisplay.map((imageURL, index) => 
                            <img key={index} src={imageURL} alt="" className="col l-4 m-4 s-4 img-outstanding-image"/>
                        )
                        :
                        <h3 className="img-outstanding-image-empty">Không có ảnh nào.</h3>
                    }
                    </div>
                </div>
                <div className="introduce-friends">
                    <span className="introduce-friends-title">Bạn bè</span>
                    {
                        friendArr && <span className="introduce-friends-total">{friendArr.length+' người bạn'}</span>
                    }
                    <div className="friends-outstanding">
                    {
                        friendDisplay
                        ?
                        friendDisplay.map(friend => 
                            <div key={friend.userId} className="col l-4 m-4 s-4 friends-outstanding-item">
                                <img 
                                    src={friend.avatar ? friend.avatar : defaultAvatar} 
                                    alt="" className="friend-outstanding-img"
                                    onClick={() => navigate(`/${friend.userId}`)}
                                />
                                <span 
                                    className="friends-outstanding-item-fullname"
                                    onClick={() => navigate(`/${friend.userId}`)}
                                >{friend.firstName+' '+friend.lastName}</span>
                            </div>
                        )
                        :
                        <h3 className='friends-outstanding-item-empty-friend'>Không có bạn bè.</h3>
                    }
                    </div>
                </div>
                <Footer />
            </div>
            <div className="col l-7 m-12 s-10 profile-post" id="profile-post">
                <CreatePostForm/>
                {
                    posts
                    ?
                    posts.map((post) => 
                        <Post key={post.id} post={post}/>
                    )
                    :
                    <div className="wrap-skeleton-profile-post">
                        <PostSkeleton />
                        <PostSkeleton />
                    </div>
                }
            </div>
        </div>
    );
}

export default memo(ProfilePosted);