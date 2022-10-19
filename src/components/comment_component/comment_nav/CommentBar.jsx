import { memo, useState, useEffect, useRef } from 'react';
import './comment_bar.scss';
import defaultAvatar from '../../../assets/defaultAvatar.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faPaperPlane, faSmile, faXmark } from '@fortawesome/free-solid-svg-icons';
import { getBase64 } from '../../../utils/convert';
import { Picker } from 'emoji-mart';
import data from '@emoji-mart/data';
import { Grid } from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { PickerComponent } from 'stipop-react-sdk';
import { useDispatch, useSelector } from 'react-redux';
import { addParentComment, addReplyComment, addReplyChildComment, createComment } from '../../../redux/commentSlice';
import { v4 as uuidv4 } from 'uuid';
import uploadToCloudinary from '../../../utils/uploadToCloudinary';

function CommentBar({ id, commentBarFor, postId }) {
    const $ = document.querySelector.bind(document)
    const dispatch = useDispatch()
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : ''
    const currentUser = useSelector(state => state.auth.login.user.userInformation)
    const avatar = currentUser.avatar
    const gf = new GiphyFetch(process.env.REACT_APP_GIPHY_KEY)
    const fetchGifs = (offset) => gf.trending({ offset, limit: 10 })
    const [imageFile, setImageFile] = useState(null)
    const [imageComment, setImageComment] = useState(null)
    const [textComment, setTextComment] = useState(null)
    const [commentContent, setCommentContent] = useState(null)
    const [commentType, setCommentType] = useState(null)
    const [keyPress, setKeyPress] = useState(null)
    
    if (keyPress === 'Enter') {
        handleComment()
        setKeyPress(null)
        setCommentType(null)
        setCommentContent(null)
        setImageFile(null)
    }
    if (textComment) {
        $(`span[id="placeholder-text-comment-box-${commentBarFor+id}"]`)?.classList.add('hidden')
    } else {
        $(`span[id="placeholder-text-comment-box-${commentBarFor+id}"]`)?.classList.remove('hidden')
    }

    useEffect(() => {
        window.addEventListener('click', controlClickCommentBox)
        return () => {
            window.removeEventListener('click', controlClickCommentBox)
        }
        function controlClickCommentBox(event){
            const stickerGroup = $(`div[id="sticker-group-${commentBarFor+id}"]`)
            const stickerButton = $(`div[id="sticker-button-${commentBarFor+id}"]`)
            const gifGroup = $(`div[id="gif-group-${commentBarFor+id}"]`)
            const gifButton = $(`div[id="gif-button-${commentBarFor+id}"]`)
            const emoteGroup = $(`div[id="emote-group-${commentBarFor+id}"]`)
            const emoteButton = $(`div[id="emote-button-${commentBarFor+id}"]`)

            controlClickButton(stickerButton, stickerGroup)
            controlClickButton(gifButton, gifGroup)
            controlClickButton(emoteButton, emoteGroup)
            
            function controlClickButton(button, group) {
                if (button.contains(event.target)) {
                    group.classList.contains('hidden')
                        ? group.classList.remove('hidden')
                        : group.classList.add('hidden')
                    button.classList.contains('active')
                        ? button.classList.remove('active')
                        : button.classList.add('active')
                } else {
                    if (!group.contains(event.target)) {
                        group.classList.add('hidden')
                        button.classList.remove('active')
                    }
                }
            }
        }
    }, [$, commentBarFor, id])

    async function handleComment() {
        const idTempo = uuidv4()
        let comment = {
            idTempo: idTempo,
            userId: currentUser.userId,
            commentType: commentType,
            commentContent: commentContent,
        }
        let commentTempo = {
            idTempo: idTempo,
            userId: currentUser.userId,
            commentType: commentType,
            commentContent: commentContent,
            userAvatar: currentUser.avatar ? currentUser.avatar : null,
            userFullName: `${currentUser.firstName+' '+currentUser.lastName}`
        }
        switch (commentBarFor) {
            case 'post':
                comment.postId = id;
                commentTempo.postId = id;
                dispatch(addParentComment(commentTempo))
                break;
            case 'parent-comment':
                comment.parentCommentId = id;
                comment.postId = postId;
                commentTempo.parentCommentId = id;
                commentTempo.postId = postId;
                dispatch(addReplyComment(commentTempo))
                break;
            case 'reply-comment':
                comment.replyCommentId = id;
                comment.postId = postId;
                commentTempo.replyCommentId = id;
                commentTempo.postId = postId;
                dispatch(addReplyChildComment(commentTempo))
                break;
            default:
                break;
        }
        if (commentType === 'image' || commentType === 'text-image') {
            const imageURL = await uploadToCloudinary.image(imageFile)
            if (commentType === 'image') {
                comment.commentContent = imageURL
            } else {
                const newCommentContent = {
                    text: (JSON.parse(commentContent)).text,
                    image: imageURL
                }
                comment.commentContent = JSON.stringify(newCommentContent)
            }
        }
        dispatch(createComment(comment))
    }
    function handlePressKeyCommentBox(event) {    
        const currentTextComment = event.currentTarget.textContent
        if (event.key === 'Enter') {
            event.preventDefault()
            const textCommentField = $(`div[id="text-comment-content-${commentBarFor+id}"]`)
            const placeHolder = $(`span[id="placeholder-text-comment-box-${commentBarFor+id}"]`)
            const cancelImageReview = $(`div[id="cancel-img-preview-${commentBarFor+id}"]`)
            if (imageComment && textComment) {
                const comment = {
                    text: currentTextComment,
                    image: imageComment,
                }
                setCommentType('text-image')   
                setCommentContent(JSON.stringify(comment))
                setTextComment(null)
                setImageComment(null)
                cancelImageReview.click()
                textCommentField.textContent = null
                placeHolder.classList.remove('hidden')
            }
            if (imageComment && !textComment) {
                setCommentContent(imageComment)
                setCommentType('image')
                setImageComment(null)
                cancelImageReview.click()   
            }
            if (!imageComment && textComment) {
                setCommentContent(currentTextComment)
                setCommentType('text')
                setTextComment(null)
                textCommentField.textContent = null
                placeHolder.classList.remove('hidden')
            }
            if (imageComment || textComment) {
                setKeyPress(event.key)
            }
        } else {
            setTextComment(currentTextComment)
        }
    }
    async function handlePreviewImage(event) {
        const data = event.target.files
        const file = data[0]
        if (file) {
            const base64Image = await getBase64(file)
            const inputImage = $(`input[id="comment-img-${commentBarFor+id}"]`)
            setImageFile(file)
            setImageComment(base64Image)
            inputImage.value = null
        }
    }
    function handleSendComment() {
        if (textComment) {
            const comment = {
                text: textComment,
                image: imageComment,
            }
            setCommentType('text-image')   
            setCommentContent(JSON.stringify(comment))
            const textCommentField = $(`div[id="text-comment-content-${commentBarFor+id}"]`)
            const placeHolder = $(`span[id="placeholder-text-comment-box-${commentBarFor+id}"]`)
            textCommentField.textContent = null
            placeHolder.classList.remove('hidden')
        } else {
            setCommentContent(imageComment)
            setCommentType('image')   
        }
        setKeyPress('Enter')
        $(`div[id="cancel-img-preview-${commentBarFor+id}"]`).click()
    }
    function handleSelectEmoji(e) {
        $(`div[id="text-comment-content-${commentBarFor+id}"]`).innerHTML = `${textComment ? textComment+e.native : e.native}`
        setTextComment(textComment ? textComment+e.native : e.native)
        $(`div[id="text-comment-content-${commentBarFor+id}"]`).focus()
        document.execCommand('selectAll', false, null)
        document.getSelection().collapseToEnd()
    }
    function handleCommentGIF(object) {
        setCommentType('gif')
        setCommentContent(JSON.stringify(object))
        setKeyPress('Enter')
    }
    function handleCommentSticker(res) {
        setCommentType('sticker')
        setCommentContent(res.url)
        setKeyPress('Enter')
    }
    function EmojiPicker(props) {
        const ref = useRef()
        useEffect(() => {
            new Picker({ ...props, data, ref })
        }, [props])
        return <div ref={ref} />
    }

    return (
        <div className={"wrap-comment-group"+themeMode}>
            <div className="wrap-comment-nav">
                <div className="comment-nav-left">
                    <img src={avatar ? avatar : defaultAvatar} alt="" className="avatar-current-user" />
                </div>
                <input 
                    hidden type="file" id={"comment-img-"+commentBarFor+id} 
                    onChange={(event) => handlePreviewImage(event)}
                />
                <div className="comment-nav-right">
                    <div className="wrap-comment-box">
                        <div className="wrap-text-comment-box">
                            <div className="wrap-text-comment-layer1">
                                <div className="wrap-text-comment-layer2">
                                    <div 
                                        contentEditable="true"
                                        id={"text-comment-content-"+commentBarFor+id} className="text-comment-content"
                                        onInput={(event) => setTextComment(event.currentTarget.textContent)}
                                        onKeyDown={(event) => handlePressKeyCommentBox(event)}
                                    >
                                    </div>
                                    <span 
                                        id={"placeholder-text-comment-box-"+commentBarFor+id}
                                        className="placeholder-text-comment-box disable-select"
                                        onClick={() => document.querySelector(`div[id="text-comment-content-${commentBarFor+id}"]`).focus()}
                                    >Viết bình luận...</span>
                                </div>
                            </div>
                        </div>
                        <div className="button-comment-group disable-select">
                            <span className="wrap-button-comment">
                                <div 
                                    role="button" aria-label="Biểu tượng cảm xúc" className="button-comment"
                                    id={"emote-button-"+commentBarFor+id}
                                >
                                    <FontAwesomeIcon icon={faSmile} className="button-comment-icon"/>
                                </div>
                            </span>
                            <span className="wrap-button-comment">
                                <div 
                                    role="button" aria-label="Ảnh hoặc video" className="button-comment"
                                    onClick={() => {
                                        $(`input[id="comment-img-${commentBarFor+id}"]`).click()
                                    }}
                                >
                                    <FontAwesomeIcon icon={faCamera} className="button-comment-icon"/>
                                </div>
                            </span>
                            <span className="wrap-button-comment">
                                <div 
                                    role="button" aria-label="Nhãn dán" className="button-comment"
                                    id={"sticker-button-"+commentBarFor+id}
                                >
                                    <span className="role-sticker">
                                        <FontAwesomeIcon icon={faSmile} className="sticker-icon"/>
                                    </span>
                                </div>
                            </span>
                            <span className="wrap-button-comment">
                                <div 
                                    role="button" aria-label="GIF" className="button-comment"
                                    id={"gif-button-"+commentBarFor+id}
                                >
                                    <span className="role-gif">
                                        <p className="gif-title">GIF</p>
                                    </span>
                                </div>
                            </span>
                        </div>
                        <div id={"emote-group-"+commentBarFor+id} className="wrap-emote-group hidden">
                            <EmojiPicker 
                                navPosition="top" previewPosition="none" perLine="8" skin="2"
                                maxFrequentRows="2"
                                theme={themeMode === ' dark' ? 'dark' : 'light'} 
                                onEmojiSelect={handleSelectEmoji} searchPosition="none"
                            />
                        </div>
                        <div id={"gif-group-"+commentBarFor+id} className="wrap-gif-group hidden">
                            <Grid 
                                width={300} columns={1} gutter={2} hideAttribution={true}
                                fetchGifs={fetchGifs} onGifClick={(gif, e) => {
                                    e.preventDefault()
                                    handleCommentGIF(gif)
                                }}
                            />
                        </div>
                        <div id={"sticker-group-"+commentBarFor+id} className="wrap-sticker-group hidden">
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
                                    width: 310,
                                    height: 360,
                                    imgSize: 100,
                                }}
                                menu={{
                                    bottomLine: themeMode === ' dark' ? 'rgba(255, 255, 255, 0.2)' : '#000',
                                    selectedLine:'3px solid rgb(32, 140, 235)',
                                    arrowColor: 'rgb(32, 140, 235)',
                                    imgSize: 36,
                                    listCnt: 5,
                                    backgroundColor:  themeMode === ' dark' ? '#323232' : '#fff'
                                }}
                                backgroundColor={ themeMode === ' dark' ? '#232323' : '#fff' }                               
                                loadingColor='rgb(32, 140, 235)'
                                shadow='none'
                                stickerClick={(url) => handleCommentSticker(url)}
                                storeClick={(click) => console.log(click)}
                                params={{
                                    apikey: `${process.env.REACT_APP_STIPOP_API_KEY}`,
                                    userId: `${currentUser.userId}`,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {
                imageComment !== null &&
                <div id={"wrapper-img-preview-"+commentBarFor+id} className="wrapper-img-preview">
                    <img className="img-preview" alt="" src={imageComment}/>
                    <div className="img-preview-btn-group">
                        <div 
                            className="img-preview-btn cancel" id={"cancel-img-preview-"+commentBarFor+id}
                            onClick={() => setImageComment(null)}
                        >
                            <FontAwesomeIcon icon={faXmark} className="cancel-icon" />
                        </div>
                        <div 
                            className="img-preview-btn send"
                            onClick={handleSendComment}
                        >
                            <FontAwesomeIcon icon={faPaperPlane} className="send-icon" />
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default memo(CommentBar);
