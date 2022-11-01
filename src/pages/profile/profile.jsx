import { useEffect, useState, useRef, memo } from 'react';
import './profile.scss';
import defaultAvatar from '../../assets/defaultAvatar.png';
import defaultCoverImage from '../../assets/defaultCoverImage.jpg';
import ProfileFriends from '../../components/profile_components/ProfileFriends/ProfileFriends';
import ProfileSkeleton from '../../components/skeleton/profile/ProfileSkeleton';
import { Link, useParams } from 'react-router-dom';
import ProfilePosted from '../../components/profile_components/ProfilePosted/ProfilePosted';
// import ProfileInfo from '../../components/profile_components/ProfileInfo/ProfileInfo';
import ProfileImg from '../../components/profile_components/ProfileImg/ProfileImg';
import { useDispatch, useSelector } from 'react-redux';
import { getBase64 } from '../../utils/convert';
import userAPI from '../../services/userAPI';
import notificationAPI from '../../services/notificationAPI';
import uploadToCloudinary from '../../utils/uploadToCloudinary';
import { modifiedUserAvatar } from '../../redux/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faXmark, faCirclePlus, faPaperPlane, faCheck } from '@fortawesome/free-solid-svg-icons';
import { createDisplayChatBox } from '../../utils/chatFunction';
import { roomIdInChatStore } from '../../utils/chatFunction';
import { CircularProgress } from 'react-cssfx-loading/lib';

function Profile({ reRenderApp, socket }) {
    const $ = document.querySelector.bind(document)
    const $$ = document.querySelectorAll.bind(document)
    const dispatch = useDispatch()
    const [userInfo, setUserInfo] = useState()
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : '';
    const userFriendArr = userInfo?.friend ? JSON.parse(userInfo.friend) : null
    const currentUser = useSelector(state => state.auth.login.user.userInformation)
    const [reviewAVT, setReviewAVT] = useState()
    const [avatar, setAvatar] = useState()
    const [displayPost, setDisplayPost] = useState(true)
    const [displayFriend, setDisplayFriend] = useState(false)
    const [displayImage, setDisplayImage] = useState(false)
    const [addFriend, setAddFriend] = useState(false) 
    const [processing, setProcessing] = useState(false)
    const [allFriendInfo, setAllFriendInfo] = useState(null)
    const [currentParams, setCurrentParams] = useState(useParams().userId)
    const profileUser = useParams()
    const checkSentFriendRequest = useRef(false)
    const previousScrollY = useRef(0)
    // const previousBottom = useRef(0)

    if (profileUser.userId !== currentParams) {
        setCurrentParams(profileUser.userId)
        setUserInfo(null)
        getProfileInfo(currentUser, profileUser).then(info => setUserInfo(info))
    }

    if (userInfo) {
        document.title = `${userInfo.firstName+' '+userInfo.lastName} - GSocial`
        if (!checkSentFriendRequest.current) {
            const isSentFriendRequest = currentUser.friendRequest ? currentUser.friendRequest.includes(userInfo?.userId) : false
            setAddFriend(isSentFriendRequest)
            checkSentFriendRequest.current = true
        }
    }

    useEffect(() => {
        getProfileInfo(currentUser, profileUser).then(info => setUserInfo(info))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    
    useEffect(() => {
        if (userInfo) {
            controlClickProfileNav()
        }
        window.addEventListener("scroll", stickyNav)
        return () => {
            window.removeEventListener("scroll", stickyNav)
        }
        function controlClickProfileNav() {
            const navs = $$('.user-nav-item')
            const navActive = $('li[class="user-nav-item active"]')
            const line = $('.profile-nav-line')
            line.style.left = navActive.offsetLeft + "px"
            line.style.width = navActive.offsetWidth + "px"
            navs.forEach((nav, index) => {
                nav.onclick = () => {
                    switch (index) {
                        case 0:
                            setDisplayPost(true)
                            setDisplayFriend(false)
                            setDisplayImage(false)
                            break;
                        case 1:
                            setDisplayPost(false)
                            setDisplayFriend(true)
                            setDisplayImage(false)
                            break;
                        case 2:
                            setDisplayPost(false)
                            setDisplayFriend(false)
                            setDisplayImage(true)
                            break;
                        default:
                            break;
                    }
                    $('.user-nav-item.active').classList.remove('active')
                    nav.classList.add('active')
                    line.style.left = nav.offsetLeft + "px"
                    line.style.width = nav.offsetWidth + "px"
                }
            })
        }
        function stickyNav() {
            const profileIntroduce = document.querySelector('div[id="profile-info-height"]')
            const profileTopHeight = $('div[id="cover-img-height"]')?.offsetHeight
            const introduceHeight = profileIntroduce?.offsetHeight
            const introduceWidth = profileIntroduce?.offsetWidth
            const profilePostHeight = $('div[id="profile-post"]')?.offsetHeight
            const navHeight = $('div[class="wrapper-profile-nav"]')?.offsetHeight
            const topbarHeight = 64
            if (window.scrollY > profileTopHeight - navHeight) {
                $('div[id="sticky-nav-profile"]')?.classList.remove('hidden') 
            } else {
                $('div[id="sticky-nav-profile"]')?.classList.add('hidden')
            }
            if (introduceHeight < profilePostHeight && introduceHeight > (window.innerHeight - topbarHeight)) {
                // console.log(isScrollToTop(window.scrollY) , window.scrollY > profileTopHeight)
                if (window.scrollY > introduceHeight - 50) {
                    profileIntroduce.setAttribute('style',
                        `position: fixed; bottom: 5px;width: ${introduceWidth}px;max-width: 467px;`)
                    $('div[id="profile-post"]').setAttribute('style',`margin-left: ${introduceWidth}px;`)
                } else {
                    profileIntroduce.setAttribute('style','position: relative;')
                    $('div[id="profile-post"]').setAttribute('style',`margin-left: 0;`)
                }

                // if (isScrollToTop(window.scrollY)) {
                //     if (window.scrollY > profileTopHeight) {
                //         profileIntroduce.setAttribute('style',
                //             `position: fixed; 
                //             bottom: ${window.scrollY - previousScrollY.current + previousBottom.current}px;
                //             width: ${introduceWidth}px;
                //             max-width: 467px;`
                //         )
                //         previousBottom.current += window.scrollY - previousScrollY.current
                //     }
                //     if (window.scrollY <= profileTopHeight) {

                //     }
                // }

                // if (isScrollToBottom(window.scrollY)) {
                    
                // }

            } 
            previousScrollY.current = window.scrollY
            // function isScrollToTop(currentScrollY) {
            //     if (currentScrollY < previousScrollY.current) {
            //         return true
            //     }
            //     return false
            // }
            // function isScrollToBottom(currentScrollY) {
            //     if (currentScrollY > previousScrollY.current) {
            //         return true
            //     }
            //     return false
            // }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo])
    
    async function getProfileInfo(currentUser, profileUser) {
        if (currentUser.userId === profileUser.userId) {
            return currentUser
        } else {
            const res = await userAPI.getProfileInfo(profileUser.userId)
            setAllFriendInfo(res.data.friendInfo)
            return res.data.userInformation
        }
    }
    function toggleDisplayAvatarModal() {
        const avatarModal = $('div[id="change-avatar-modal"]')
        avatarModal.classList.contains('hidden')
            ? avatarModal.classList.remove('hidden')
            : avatarModal.classList.add('hidden')
    }
    function handleOpenNormalChat(userId) {
        const roomId = roomIdInChatStore(userId)
        roomId 
            ? createDisplayChatBox(null, null, null, roomId) 
            : createDisplayChatBox(userInfo.userId, userInfo.avatar, `${userInfo.firstName+' '+userInfo.lastName}`, null)
    }
    async function handleImage(event) {
        const data = event.target.files
        const file = data[0]
        if (file) {
            setAvatar(file)
            const base64Image = await getBase64(file)
            setReviewAVT(base64Image)
        }
    }
    async function handleChangeAvatar() {
        const avatarURL = await uploadToCloudinary.image(avatar)
        const res = await userAPI.modifiedInfoUser(currentUser.userId, { avatar: avatarURL })
        if (res.data.errCode === 0) {
            dispatch(modifiedUserAvatar(avatarURL))
            toggleDisplayAvatarModal()
        }
    }
    async function handleToggleFriendRequest() {
        setProcessing(true)
        let payload = {
            fromUser: currentUser.userId, 
            toUser: userInfo.userId,
        }
        if (addFriend) {
            payload.isAccept = false
            const res = await notificationAPI.responseFriendRequest(payload)
            if (res.data) {
                setProcessing(false)
                setAddFriend(false)
            }
        } else {
            const res = await notificationAPI.createFriendRequest(payload)
            if (res.data) {
                socket.current.emit('clientSendNewFriendRequest', { toUserId: userInfo.userId })
                setProcessing(false)
                setAddFriend(true)
            }
        }
    }
    
    return (
        <>
            <div className={"wrapper-profile-page"+themeMode}>
            {
                userInfo
                ?
                <div id="profile-content" className="grid profile-contain">
                    <div id="sticky-nav-profile" className="row sticky-nav disable-select hidden">
                        <div className="col l-12 m-12 s-12 sticky-nav">
                            <div 
                                className="sticky-nav-left"
                                onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                            >
                                <div className="wrapper-user-avatar">
                                    <img src={userInfo.avatar ? userInfo.avatar : defaultAvatar} alt="" className="user-avatar" />
                                </div>
                                <span className="user-fullname">{userInfo.firstName+" "+userInfo.lastName}</span>
                            </div>
                            <div className="sticky-nav-right">
                            {   
                                (currentUser.userId === profileUser.userId)
                                ?
                                <></>
                                :
                                (!userFriendArr || !userFriendArr.includes(currentUser.userId))
                                    ?
                                    <>
                                        <li 
                                            id="add-friend-button"
                                            className="profile-nav btn btn--primary btn-add-friend"
                                            onClick={() => {
                                                handleToggleFriendRequest()
                                            }}
                                        >
                                            {
                                                processing
                                                ?
                                                <CircularProgress color='#e4e6eb' style={{margin: 8, width: 26, height: 26}} />
                                                :
                                                <FontAwesomeIcon icon={addFriend ? faXmark : faCirclePlus} className="profile-nav-icon"/>
                                            }
                                            <span className="button-desc add-friend">{addFriend ? 'Hủy lời mời kết bạn' : 'Thêm bạn'}</span>
                                        </li>
                                        <li 
                                            className="profile-nav btn switch-mode" 
                                            onClick={() => {
                                                handleOpenNormalChat(userInfo.userId)
                                                reRenderApp()
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faPaperPlane} className="profile-nav-icon"/>
                                            <span className="button-desc">Nhắn tin</span>
                                        </li>  
                                    </>
                                    :
                                    <>
                                        <li className="profile-nav btn switch-mode">
                                            <FontAwesomeIcon icon={faCheck} className="profile-nav-icon"/>
                                            <span className="button-desc">Bạn bè</span>
                                        </li>
                                        <li 
                                            className="profile-nav btn btn--primary message" 
                                            onClick={() => {
                                                handleOpenNormalChat(userInfo.userId)
                                                reRenderApp()
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faPaperPlane} className="profile-nav-icon"/>
                                            <span className="button-desc">Nhắn tin</span>
                                        </li>                                            
                                    </>
                            }
                            </div>
                        </div>
                    </div> 
                    <div id="cover-img-height" className="row top-profile">
                        <div className="col profile-cover-image"> {/*userInfo.coverImage ? userInfo.coverImage :*/} 
                            <div 
                                alt="cover-img" className="cover-img" 
                                style={{backgroundImage: `url(${defaultCoverImage})`}}
                            />
                        </div>
                        <div id="introduce-nav-height" className="col profile-top">
                            <div className="user-wrapper">
                                <div className="wrapper-avatar">
                                    <img src={ userInfo.avatar ? userInfo.avatar : defaultAvatar } alt="avatar" className="user-img" />
                                    {
                                        (currentUser.userId === profileUser.userId) &&
                                        <div className="wrapper-icon-change-img" onClick={toggleDisplayAvatarModal}>
                                            <FontAwesomeIcon icon={faCamera} className="icon-change-img" />
                                        </div>
                                    }
                                </div>
                                <span className="user-full-name">{userInfo.firstName+" "+userInfo.lastName}</span>
                            </div>
                            <div className="wrapper-profile-nav">
                                <ul className="user-nav">
                                    <Link to={`/${userInfo.userId}`}>
                                        <li className="user-nav-item active">
                                            <span className="item-title">Bài viết</span>
                                        </li>
                                    </Link>
                                    {/* <Link to={`/${userInfo.userId}/introduce`}>
                                        <li className="user-nav-item">
                                            <span className="item-title">Giới thiệu</span>
                                        </li>
                                    </Link> */}
                                    <Link to={`/${userInfo.userId}/friends`}>
                                        <li className="user-nav-item">
                                            <span className="item-title">Bạn bè</span>
                                        </li>
                                    </Link>
                                    <Link to={`/${userInfo.userId}/image`}>
                                        <li className="user-nav-item">
                                            <span className="item-title">Ảnh</span>
                                        </li>
                                    </Link>
                                    <div className="profile-nav-line" />
                                </ul>
                                <ul className="profile-nav right disable-select">
                                {   
                                    (currentUser.userId === profileUser.userId)
                                    ?
                                    <></>
                                    :
                                    (!userFriendArr || !userFriendArr.includes(currentUser.userId))
                                        ?
                                        <>
                                            <li 
                                                id="add-friend-button"
                                                className="profile-nav btn btn--primary btn-add-friend"
                                                onClick={() => {
                                                    handleToggleFriendRequest()
                                                }}
                                            >   
                                                {
                                                    processing
                                                    ?
                                                    <CircularProgress color='#e4e6eb' style={{margin: 8, width: 26, height: 26}} />
                                                    :
                                                    <FontAwesomeIcon icon={addFriend ? faXmark : faCirclePlus} className="profile-nav-icon"/>
                                                }
                                                <span className="button-desc add-friend">{addFriend ? 'Hủy lời mời kết bạn' : 'Thêm bạn'}</span>
                                            </li>
                                            <li 
                                                className="profile-nav btn switch-mode"
                                                onClick={() => { 
                                                    handleOpenNormalChat(userInfo.userId)
                                                    reRenderApp()
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faPaperPlane} className="profile-nav-icon"/>
                                                <span className="button-desc">Nhắn tin</span>
                                            </li>  
                                        </>
                                        :
                                        <>
                                            <li className="profile-nav btn switch-mode">
                                                <FontAwesomeIcon icon={faCheck} className="profile-nav-icon"/>
                                                <span className="button-desc">Bạn bè</span>
                                            </li>
                                            <li 
                                                className="profile-nav btn btn--primary"
                                                onClick={() => {                                                     
                                                    handleOpenNormalChat(userInfo.userId)
                                                    reRenderApp()
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faPaperPlane} className="profile-nav-icon"/>
                                                <span className="button-desc">Nhắn tin</span>
                                            </li>                                            
                                        </>
                                }
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="row row-user">
                    {
                        displayPost && <ProfilePosted friendArr={userFriendArr} allFriendInfo={allFriendInfo} userInfo={userInfo}/>
                    }
                    {/* <ProfileInfo /> */}
                    {
                        displayFriend && <ProfileFriends allFriendInfo={allFriendInfo} />
                    }
                    {
                        displayImage && <ProfileImg userInfo={userInfo} />
                    }
                    </div> 
                </div>
                :
                <ProfileSkeleton />
            }
            </div>
            {
                (currentUser.userId === profileUser.userId) &&
                <div id="change-avatar-modal" className="modal hidden">
                    <div className="modal__overlay"> 
                    </div> 
                    <div className="modal__body"> 
                        {/* Change avatar form */}
                        <div className="avatar-form">
                            <div className="avatar-form__container">
                                <div className="avatar-form__top">
                                    <span className="avatar-form__heading">Cập nhật ảnh đại diện</span>
                                    <div className="exit-icon-wrapper" onClick={toggleDisplayAvatarModal}>
                                        <FontAwesomeIcon icon={faXmark} className="exit-icon"/>
                                    </div>
                                </div>
                                <div className="avatar-form__main">
                                    <div className="wrapper-avatar">
                                        <input hidden id="avatar-input" type="file" accept="image/*" onChange={(event) => handleImage(event)}/> 
                                        <button className="btn btn--primary avatar-button" 
                                            onClick={() => document.querySelector('input[id="avatar-input"]').click()}
                                        >
                                            <FontAwesomeIcon icon={faCirclePlus} className="icon-add"/>
                                            Tải ảnh lên
                                        </button>
                                        {
                                            reviewAVT && <img src={reviewAVT} alt="avatar-review" className="avatar-review"/>
                                        }
                                    </div>
                                </div>
                                {
                                    reviewAVT
                                    &&
                                    <div className="avatar-form__bottom">
                                        <button className="btn btn-modified" onClick={toggleDisplayAvatarModal}>Hủy</button>
                                        <button className="btn btn--primary btn-modified" onClick={handleChangeAvatar}>Lưu</button>
                                    </div>     
                                }
                            </div>
                        </div>  
                    </div> 
                </div>
            }
        </>

    )
}

export default memo(Profile);
