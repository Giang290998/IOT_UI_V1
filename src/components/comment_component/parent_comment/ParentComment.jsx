import { memo, useState, useEffect } from 'react';
import './parent_comment.scss';
import { useSelector } from 'react-redux';
import ReplyComment from '../reply_comment/ReplyComment';
import Comment from '../comment/Comment';
import CommentBar from '../comment_nav/CommentBar';
 
function ParentComment({ parentComment, postId }) {
    const $ = document.querySelector.bind(document)
    const [isShowCommentBar, setIsShowCommentBar] = useState(false)
    const allReplyComment = JSON.parse(useSelector(state => state.comment.replyComment))
    const replyDetailArr = allReplyComment ? allReplyComment.filter(comment => (comment.parentCommentId)*1 === parentComment.id) : null
    const [parentCommentHeight, setParentCommentHeight] = useState(0)
    const heightAvatarUserComment = 40

    useEffect(() => {
        setParentCommentHeight($(`div[id="parent-comment-${parentComment.id}"]`).offsetHeight)
    }, [$, parentComment.id])
    
    function handleShowCommentBar() {
        setIsShowCommentBar(true)
        const commentBar = $(`div[id="comment-bar-parent-comment-${parentComment.id}"]`)
        const textField = $(`div[id="text-comment-content-parent-comment${parentComment.id}"]`)
        if (commentBar.classList.contains('hidden')) {
            commentBar.classList.remove('hidden')
            textField.focus()
        } else {
            textField.focus()
        }
    }
    return (
        <div className={"parent-comment"}>
            <div id={"wrap-parent-comment-"+parentComment.id} className="parent-comment-content">
                <div id={"parent-comment-"+parentComment.id}>
                    <Comment 
                        comment={parentComment} key={'parent-comment'+parentComment.id} role='parent-comment'
                        showCommentBar={handleShowCommentBar} childCommentShow={replyDetailArr ? replyDetailArr.length : 0}
                    />
                </div>
                {
                    replyDetailArr?.map((reply) => {
                        const isOneReply = replyDetailArr.length === 1 ? true : false
                        let isLastReply = false
                        let isFirstReply = false
                        let extraBorderHeight = parentCommentHeight ? parentCommentHeight - heightAvatarUserComment : 0
                        if (!isOneReply) {
                            isLastReply = reply === replyDetailArr[replyDetailArr.length - 1] ? true : false
                            isFirstReply = reply === replyDetailArr[0] ? true : false
                        } 
                        return (
                            <div id={"wrap-reply-comment-"+reply.id} key={reply.id} className="wrap-reply-comment">
                                <ReplyComment 
                                    postId={postId} replyComment={reply} isLastReply={isLastReply}
                                    isFirstReply={isFirstReply} isOneReply={isOneReply} extraBorder={extraBorderHeight}
                                    isShowReplyParentComment={isShowCommentBar}
                                />
                            </div>
                        )
                    })
                }
            </div>
            <div id={"comment-bar-parent-comment-"+parentComment.id} className="wrap-comment-bar-parent-comment hidden">
                {
                    (replyDetailArr?.length === 0) && 
                    <div className="border-comment-bar" style={{height: parentCommentHeight - heightAvatarUserComment}}/>
                }
                <CommentBar id={parentComment.id} commentBarFor='parent-comment' postId={postId} />
            </div>
        </div>
    )
}

export default memo(ParentComment);