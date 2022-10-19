import { useState, memo } from 'react'
import './create-post-form.scss'
import defaultAvatar from '../../assets/defaultAvatar.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faEarthAmericas, faCaretDown, faLock, faUserGroup, faPhotoFilm, faUserTag, faFaceLaugh } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getBase64 } from '../../utils/convert'
import postAPI from '../../services/postAPI'
import uploadToCloudinary from '../../utils/uploadToCloudinary'

function CreatePostForm() {
    const currentUser = useSelector(state => state.auth.login.user?.userInformation)
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : '';
    const $ = document.querySelector.bind(document)
    const [mode, setMode] = useState('public')
    const [descMode, setDescMode] = useState('Công khai')
    const [postImageReview, setPostImageReview] = useState()
    const [postImage, setPostImage] = useState()

    function displayPostForm() {
        $('div[id="post-form-modal"]').classList.contains('hidden')
            ? $('div[id="post-form-modal"]').classList.remove('hidden')
            : $('div[id="post-form-modal"]').classList.add('hidden')
    }
    function handleMode(mode) {
        setMode(mode)
        let publicIcon = $('svg[id="public"]')
        let friendIcon = $('svg[id="friend"]')
        let privateIcon = $('svg[id="private"]')
        if (!publicIcon.classList.contains('hidden')) {
            publicIcon.classList.add('hidden')
        }
        if (!friendIcon.classList.contains('hidden')) {
            friendIcon.classList.add('hidden')
        }
        if (!privateIcon.classList.contains('hidden')) {
            privateIcon.classList.add('hidden')
        }
        switch (mode) {
            case 'public':
                setDescMode('Công khai')
                publicIcon.classList.remove('hidden')
                break;
            case 'friend':
                setDescMode('Bạn bè')
                friendIcon.classList.remove('hidden')
                break;
            case 'private':
                setDescMode('Chỉ mình tôi')
                privateIcon.classList.remove('hidden')
                break;
            default:
                break;
        }
    }
    function showModeOption() {
        if ($('ul[id="mode-list"]').classList.contains('hidden')) {
            $('ul[id="mode-list"]').classList.remove('hidden')
        } else {
            $('ul[id="mode-list"]').classList.add('hidden')
        }
    }
    async function handleShowPostImg(event) {
        const data = event.target.files
        const file = data[0]
        if (file) {
            setPostImage(file)
            const base64Image = await getBase64(file)
            setPostImageReview(base64Image)
        }
    }
    async function handleCreatePost() {
        const postImageURL = postImage ? await uploadToCloudinary.image(postImage) : null
        const text = $('div[id="text-content"]').textContent
        const newPost = {
            id: currentUser.userId, 
            textContent: text, 
            imageContent: postImageURL,
            mode: mode,
        }
        const res = await postAPI.createNewPost(newPost)
        if (res.data.errCode === 0) {
            displayPostForm()
        }
    }
    function handleChangeTextPostInput(event) {
        const textInput = event.currentTarget.textContent
        const placeholder = $('span[id="placeholder-text-post"]')
        textInput
            ? placeholder.classList.add("hidden")
            : placeholder.classList.remove("hidden")
    }

    return (
        <div className={"create-post-form"+themeMode}>  
            <div className="post-form-click">
                <div className="post-form-click-wrapper-top">
                    <Link to={`/${currentUser.userId}`}>
                        <img src={ currentUser.avatar ? currentUser.avatar : defaultAvatar} alt="" className="user-img disable-select"/>
                    </Link>
                    <p className="post-form-click-form" onClick={displayPostForm}>{currentUser.lastName} ơi, bạn đang nghĩ gì thế?</p>
                </div>
                <div className="post-form-click-wrapper-bottom">
                    <div className="post-form-click-add" onClick={displayPostForm}>
                        <FontAwesomeIcon icon={faPhotoFilm} className="photo-icon-add" />
                        <span className="add-title">Ảnh</span>
                    </div>
                    <div className="post-form-click-add" onClick={displayPostForm}>
                        <FontAwesomeIcon icon={faUserTag} className="user-icon-add" />
                        <span className="add-title">Gắn thẻ</span>
                    </div>
                    <div className="post-form-click-add" onClick={displayPostForm}>
                        <FontAwesomeIcon icon={faFaceLaugh} className="emote-icon-add" />
                        <span className="add-title">Cảm xúc</span>
                    </div>
                </div>
            </div>
            <div id="post-form-modal" className="modal hidden">
                <div className="modal__overlay"> 
                </div> 
                <div className="modal__body"> 
                    {/* Post form */}
                    <div className="post-form">
                        <div className="post-form__container">
                            <div className="post-form__top">
                                <span className="post-form__heading">Tạo bài viết</span>
                                <div className="exit-icon-wrapper" onClick={displayPostForm}>
                                    <FontAwesomeIcon icon={faXmark} className="exit-icon"/>
                                </div>
                            </div>
                            <div className="post-form__main">
                                <div className="post-form__main-top">
                                    <div className="post-form__author">
                                        <img src={ currentUser.avatar ? currentUser.avatar : "https://i.stack.imgur.com/YaL3s.jpg"} alt="" className="auhtor-img" />
                                        <span className="author-name">{currentUser.firstName} {currentUser.lastName}</span>
                                    </div>
                                    <div className="post-form__mode disable-select hidden" onClick={showModeOption}>
                                        <FontAwesomeIcon id="public" icon={faEarthAmericas} className="mode-icon"/>
                                        <FontAwesomeIcon id="friend" icon={faUserGroup} className="mode-icon hidden"/> 
                                        <FontAwesomeIcon id="private" icon={faLock} className="mode-icon hidden"/>
                                        <span className="mode-desc" value={mode}>{descMode}</span>
                                        <FontAwesomeIcon icon={faCaretDown} className="down-icon"/>
                                        <ul className="post-form__mode-list hidden" id="mode-list">
                                            <li className="post-form__mode-item" value="public"
                                                onClick={() => handleMode('public') }
                                            >
                                                <FontAwesomeIcon icon={faEarthAmericas} className="mode-icon"/>
                                                <span className="mode-desc">Công khai</span>
                                            </li>
                                            <li className="post-form__mode-item" value="friend"
                                                onClick={() => handleMode('friend') }
                                            >
                                                <FontAwesomeIcon icon={faUserGroup} className="mode-icon"/>
                                                <span className="mode-desc">Bạn bè</span>
                                            </li>
                                            <li className="post-form__mode-item" value="private"
                                                onClick={() => handleMode('private') }
                                            >
                                                <FontAwesomeIcon icon={faLock} className="mode-icon"/>
                                                <span className="mode-desc">Chỉ mình tôi</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="post-form__main-content">
                                    <div className="wrapper-text-content-layer1">
                                        <div className="wrapper-text-content-layer2">
                                            <div 
                                                contentEditable="true"
                                                id="text-content" className="text-content"
                                                onInput={handleChangeTextPostInput}
                                            >
                                            </div>
                                            <span 
                                                id="placeholder-text-post"
                                                className="placeholder-text-post disable-select"
                                                onClick={() => $('div[id="text-content"]').focus()}
                                            >{currentUser.lastName +" ơi, bạn đang nghĩ gì thế ?"}</span>
                                        </div>
                                    </div>
                                    {
                                        postImageReview && <div 
                                            className="wrapper-post-img"
                                        >
                                            <img src={postImageReview} alt="" className="post-img"/>
                                        </div>
                                    }
                                    
                                </div>
                            </div>

                            <div className="post-form__bottom">
                                <div className="bottom-tag-wrapper">
                                    <span className="tag-title">Thêm vào bài viết</span>
                                    <input hidden id="post-img" type="file" accept="image/*" onChange={event => handleShowPostImg(event)}/>
                                    <div className="icon-wrapper" onClick={() => $('input[id="post-img"]').click()}>
                                        <FontAwesomeIcon icon={faPhotoFilm} className="photo-icon"/>
                                    </div>
                                    <div className="icon-wrapper">
                                        <FontAwesomeIcon icon={faUserTag} className="user-tag-icon"/>
                                    </div>
                                    <div className="icon-wrapper">
                                        <FontAwesomeIcon icon={faFaceLaugh} className="emote-icon"/>
                                    </div>
                                </div>
                                <button className="btn btn--primary btn-modified" onClick={handleCreatePost}>Đăng</button>
                            </div>     
                        </div>
                    </div>  
                </div> 
            </div> 
        </div>
    )
}

export default memo(CreatePostForm)
