import { memo, useState, useEffect } from 'react';
import './comment.scss';
import defaultAvatar from '../../../assets/defaultAvatar.png';
import { Spin } from 'react-cssfx-loading/lib';
import { Gif } from '@giphy/react-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faArrowTurnUp, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import commentAPI from '../../../services/commentAPI';
import timeFormat from '../../../utils/timeFormat';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addReplyComment, addReplyChildComment } from '../../../redux/commentSlice';
import { useSelector } from 'react-redux';

function Comment({ comment, role, showCommentBar, childCommentShow }) {
    const $ = document.querySelector.bind(document)
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : ''
    const currentUser = useSelector(state => state.auth.login.user.userInformation)
    const currentUserId = currentUser.userId
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const isSaveDataBase = comment.id ? ' save' : null
    const [likeArr, setLikeArr] = useState(comment.like ? JSON.parse(comment.like) : [])
    const [timeAgo, setTimeAgo] = useState(timeFormat.timeAgo(comment.createdAt))
    const [replyNumber, setReplyNumber] = useState(getTotalReply())
    const [isShowReply, setIsShowReply] = useState(false)
    const [loadingChildComment, setLoadingChildComment] = useState(false)

    useEffect(() => {
        const T = setInterval(() => {
            setTimeAgo(timeFormat.timeAgo(comment.createdAt))
        }, 1000 * 60)
        return () => {
            clearInterval(T)
        }
    }, [comment.createdAt])

    function getTotalReply() {
        switch (role) {
            case 'parent-comment':
                return comment.replyComment?.totalReplyComment

            case 'reply-comment':
                return comment.replyChildComment?.totalReplyChildComment

            default:
                break;
        }
    }
    async function handleLikeComment() {
        if (isSaveDataBase) {
            let likeComment = {
                action: 'update_like',
                userId: currentUserId,
            }
            switch (role) {
                case 'parent-comment':
                    likeComment.parentCommentId = comment.id
                    break;
                case 'reply-comment':
                    likeComment.replyCommentId = comment.id
                    break;
                case 'reply-child-comment':
                    likeComment.replyChildCommentId = comment.id
                    break;
                default:
                    break;
            }
            const res = await commentAPI.updateComment(likeComment)
            if (res.data.errCode === 0) {
                let likeButton = $(`li[id="like-button ${role + '-' + comment.id}"]`)
                if (likeButton.classList.contains('liked')) {
                    likeButton.classList.remove('liked')
                    const index = likeArr.indexOf(currentUserId)
                    likeArr.splice(index, 1)
                    setLikeArr([...likeArr])
                } else {
                    likeButton.classList.add('liked')
                    setLikeArr([...likeArr, currentUserId])
                }
            }
        }
    }
    async function handleShowReply() {
        setLoadingChildComment(true)
        if (isSaveDataBase) {
            setIsShowReply(true)
            try {
                switch (role) {
                    case 'parent-comment':
                        const resCase1 = await commentAPI.getComment({ parentCommentId: comment.id })
                        dispatch(addReplyComment(resCase1.data.replyComment))
                        setReplyNumber(null)
                        break;
                    case 'reply-comment':
                        const resCase2 = await commentAPI.getComment({ replyCommentId: comment.id })
                        dispatch(addReplyChildComment(resCase2.data.replyChildComment))
                        setReplyNumber(null)
                        break;
                    default:
                        break;
                }
            } catch (error) {
                throw new Error(error)
            }
        }
    }
    function likeStatus() {
        if (likeArr?.includes(currentUserId)) {
            return 'liked'
        }
        return ''
    }

    return (
        <div className={"comment" + themeMode}>
            <Link to={`/${comment.userId}`} className="wrap-avatar-user-comment">
                <img
                    className="avatar-user-comment" alt=""
                    src={comment.userAvatar ? comment.userAvatar : defaultAvatar}
                />
            </Link>
            <div className="wrap-comment-body">
                <div className="wrap-comment-content">
                    <div className="wrap-comment-text">
                        <div id={role + `-${comment.id}-content`} className="comment-text">
                            <span
                                className="comment-user"
                                onClick={() => navigate(`/${comment.userId}`)}
                            >{comment.userFullName}</span>
                            {
                                (comment.commentType === 'text') &&
                                <span className="comment-text-content">{comment.commentContent}</span>
                            }
                            {
                                (comment.commentType === 'text-image') &&
                                <span className="comment-text-content">{(JSON.parse(comment.commentContent)).text}</span>
                            }
                            {
                                (likeArr?.length > 0) &&
                                <div
                                    id={"interactive-group " + role + "-" + comment.id}
                                    className="wrap-interactive-group"
                                >
                                    <div className="wrapper-icon">
                                        <FontAwesomeIcon icon={faThumbsUp} className="like-icon" />
                                    </div>
                                    <span className="like-num">{likeArr.length}</span>
                                </div>
                            }
                        </div>
                    </div>
                    {
                        (comment.commentType === 'text-image') &&
                        <img className="img-comment" alt="" src={(JSON.parse(comment.commentContent)).image} />
                    }
                    {
                        (comment.commentType === 'image') &&
                        <img className="img-comment" alt="" src={comment.commentContent} />
                    }
                    {
                        (comment.commentType === 'sticker') &&
                        <img className="sticker-comment" alt="" src={comment.commentContent} />
                    }
                    {
                        (comment.commentType === 'gif') &&
                        <div style={{ "marginBottom": 4 }}>
                            <Gif
                                gif={JSON.parse(comment.commentContent)} width={300} hideAttribution={true}
                                onGifClick={(gif, e) => {
                                    e.preventDefault()
                                }}
                            />
                        </div>
                    }
                    <ul className="interactive-comment">
                        <li
                            className={"i-comment-item disable-select " + likeStatus() + isSaveDataBase}
                            onClick={handleLikeComment} id={"like-button " + role + "-" + comment.id}
                        >Thích</li>
                        <li
                            className={"i-comment-item disable-select" + isSaveDataBase}
                            onClick={() => {
                                showCommentBar()
                                if (!isShowReply) {
                                    handleShowReply()
                                }
                            }}
                        >Phản hồi</li>
                        <li className="i-comment-item time disable-select">{timeAgo}</li>
                    </ul>
                    {
                        (replyNumber > childCommentShow) &&
                        <div
                            className="show-reply-comment disable-select"
                            id={"show-reply-comment " + role + "-" + comment.id}
                            onClick={() => handleShowReply()}
                        >
                            <div className="show-reply-comment-icon-wrap">
                                <FontAwesomeIcon icon={faArrowTurnUp} className="show-reply-comment-icon" />
                            </div>
                            <span className="show-reply-comment-desc">Xem {replyNumber} phản hồi</span>
                            {
                                loadingChildComment
                                &&
                                <div className="wrap-loading-child-comment-icon">
                                    <Spin color={themeMode === ' dark' ? '#b0b3b8' : '#616161'} />
                                </div>
                            }
                        </div>
                    }
                </div>
                <div className="wrap-comment-option">
                    <span className="wrap-comment-btn">
                        <div role="button" className="comment-option-btn">
                            <FontAwesomeIcon icon={faEllipsis} className="option-icon" />
                        </div>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default memo(Comment);
