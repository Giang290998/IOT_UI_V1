import { memo } from 'react';
import './post-skeleton.scss';
import { useSelector } from 'react-redux';

function PostSkeleton() {
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : ''
    return (
        <div className={"post-skeleton"+themeMode}>
            <div className="post-skeleton-top">
                <div className="post-skeleton-avatar skeleton-box" />
                <div className="post-skeleton-information">
                    <div className="post-skeleton-name skeleton-box" />
                    <div className="post-skeleton-time skeleton-box" />
                </div>
            </div>
            <div className="post-skeleton-main">
                <div className="post-skeleton-text skeleton-box" />
                <div className="post-skeleton-text-end skeleton-box" />
                <div className="post-skeleton-image skeleton-box" />
            </div>
        </div>
    )
}

export default memo(PostSkeleton);