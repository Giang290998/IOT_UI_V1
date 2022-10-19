import { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import './reply_comment.scss';
import ReplyChildComment from '../reply_child_comment/ReplyChildComment';
import Comment from '../comment/Comment';
import CommentBar from '../comment_nav/CommentBar';

function ReplyComment({ replyComment, postId, isFirstReply, isLastReply, isOneReply, extraBorder, isShowReplyParentComment }) {
    const $ = document.querySelector.bind(document)
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : ''
    const allReplyChildComment = JSON.parse(useSelector(state => state.comment.replyChildComment))
    const replyChildDetailArr = allReplyChildComment ? allReplyChildComment.filter(comment => (comment.replyCommentId)*1 === replyComment.id) : null
    const replyCommentHeight = $(`div[id="reply-comment-${replyComment.id}"]`)?.offsetHeight
    const heightAvatarUserComment = 38
    const [isShowCommentBar, setIsShowCommentBar] = useState(false)
    
    function handleShowCommentBar() {
        setIsShowCommentBar(true)
        const commentBar = $(`div[id="comment-bar-reply-comment-${replyComment.id}"]`)
        const textField = $(`div[id="text-comment-content-reply-comment${replyComment.id}"]`)
        if (commentBar.classList.contains('hidden')) {
            commentBar.classList.remove('hidden')
            textField.focus()
        } else {
            textField.focus()
        }
    }

    return (
        <div className={"reply-comment"+themeMode}>
            <div id={"reply-comment-"+replyComment.id} className="reply-comment-content">
                <Comment 
                    comment={replyComment} key={'reply-comment'+replyComment.id} role='reply-comment'
                    showCommentBar={handleShowCommentBar}
                    childCommentShow={replyChildDetailArr ? replyChildDetailArr.length : 0}
                />
            </div>
            <div className="wrap-reply-child-comment">
            {
                replyChildDetailArr?.map((replyChild) => {
                    const isOneReply = replyChildDetailArr.length === 1 ? true : false
                    let isLastReply = false
                    let isFirstReply = false
                    let extraBorderHeight = replyCommentHeight - heightAvatarUserComment
                    if (!isOneReply) {
                        isLastReply = replyChild === replyChildDetailArr[replyChildDetailArr.length - 1] ? true : false
                        isFirstReply = replyChild === replyChildDetailArr[0] ? true : false
                    } 
                    return (
                        <ReplyChildComment 
                            key={'reply-child'+replyChild.id}
                            postId={postId} replyChildComment={replyChild} isLastReply={isLastReply}
                            isFirstReply={isFirstReply} isOneReply={isOneReply} extraBorder={extraBorderHeight}
                            showCommentBar={handleShowCommentBar} isShowResponseReplyComment={isShowCommentBar}
                        />
                    )
                })
            }
            </div>
            <div id={"comment-bar-reply-comment-"+replyComment.id} className="wrap-comment-bar-reply-comment hidden">
                {
                    (replyChildDetailArr?.length === 0) && 
                    <div className="border-comment-bar" style={{height: replyCommentHeight - heightAvatarUserComment}}/>
                }
                <CommentBar id={replyComment.id} commentBarFor='reply-comment' postId={postId} />
            </div>
            {
                isOneReply && <div className="border-reply-comment only-one" style={{"height": extraBorder}}/>
            }
            {
                isFirstReply && <div className="border-reply-comment" style={{"height": `calc(100% + ${extraBorder}px)`}}/>
            }
            {
                (!isLastReply && !isOneReply) && <div className="border-reply-comment"/>
            }
            {
                ((isShowReplyParentComment && isLastReply) || (isShowReplyParentComment && isOneReply)) 
                && 
                <div className="border-reply-comment show-reply"/>
            }
        </div>
    )
}

export default memo(ReplyComment);
