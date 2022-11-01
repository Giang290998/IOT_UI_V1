import { memo } from 'react';
import './profile-skeleton.scss';
import { useSelector } from 'react-redux';
import PostSkeleton from '../post/PostSkeleton';

function ProfileSkeleton() {
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : '';
    return (
        <div className={"profile-skeleton"+themeMode}>
            <div className="skeleton-profile-top">
                <div className="profile-skeleton-background-image skeleton-box" />
                <div className="profile-skeleton-avatar skeleton-box" />
                <div className="profile-skeleton-name skeleton-box" />
                <div className="profile-skeleton-nav">
                    <ul className="profile-skeleton-left">
                        <li className="profile-skeleton-item skeleton-box" />
                        <li className="profile-skeleton-item skeleton-box" />
                        <li className="profile-skeleton-item skeleton-box" />
                    </ul>
                    <ul className="profile-skeleton-right">
                        <li className="profile-skeleton-item skeleton-box" />
                        <li className="profile-skeleton-item skeleton-box" />
                    </ul>
                </div>
            </div>
            <div className="grid wide skeleton-profile-bottom">
                <div className="row skeleton-profile-bottom">    
                    <div className="col l-5 m-5 s-12 skeleton-profile-bottom-left">
                        <PostSkeleton />
                    </div>
                    <div className="col l-7 m-7 s-12 skeleton-profile-bottom-right">
                        <PostSkeleton />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(ProfileSkeleton);