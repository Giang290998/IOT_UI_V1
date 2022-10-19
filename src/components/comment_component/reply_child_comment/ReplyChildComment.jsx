import { memo } from 'react';
import './reply_child_comment.scss';
import Comment from '../comment/Comment';
import { useSelector } from 'react-redux';

function ReplyChildComment({ replyChildComment, postId, isFirstReply, isLastReply, isOneReply, extraBorder, showCommentBar, isShowResponseReplyComment }) {
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : '';

    return (
        <div id={"reply-child-comment-"+replyChildComment.id} className={"reply-child-comment"+themeMode}>
            <div className="reply-child-comment-content">
                <Comment 
                    comment={replyChildComment}
                    key={'reply-comment'+replyChildComment.id} role='reply-child-comment'
                    showCommentBar={() => showCommentBar()}
                />
            </div>
            {
                isOneReply && <div className="border-reply-child-comment only-one" style={{"height": extraBorder}}/>
            }
            {
                isFirstReply && <div className="border-reply-child-comment" style={{"height": `calc(100% + ${extraBorder}px)`}}/>
            }
            {
                (!isLastReply && !isOneReply) && <div className="border-reply-child-comment"/>
            }
            {
                ((isShowResponseReplyComment && isLastReply) || (isShowResponseReplyComment && isOneReply)) &&
                <div className="border-reply-child-comment show-reply"/>
            }
        </div>
    )
}

export default memo(ReplyChildComment);
