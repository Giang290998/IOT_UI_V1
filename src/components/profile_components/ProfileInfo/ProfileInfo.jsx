import React from 'react'
import './profile_info.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons'

export default function ProfileInfo() {
    return (
        
        <div className="profile-content">
            <div className="col l-3 profile-info">
                <span className="profile-info-title">Giới thiệu</span>
                <ul className="profile-info-list">
                    <li className="profile-info-item">
                        <span className="profile-info-item-title">Tổng quan</span>
                    </li>
                    <li className="profile-info-item">
                        <span className="profile-info-item-title">Công việc và học vấn</span>
                    </li>
                    <li className="profile-info-item">
                        <span className="profile-info-item-title">Nơi từng sống</span>
                    </li>
                    <li className="profile-info-item">
                        <span className="profile-info-item-title">Thông tin cá nhân cơ bản</span>
                    </li>
                    <li className="profile-info-item">
                        <span className="profile-info-item-title">Gia đình và các mối quan hệ</span>
                    </li>
                </ul>
            </div>
            <div className="col l-9 profile-info-desc">
                {/* <Overview/> */}
            </div>    
        </div>
    
    )
}

function Overview() {
    return (

        <>
            <ul className="profile-info-desc-list">
                <li className="profile-info-desc-item">
                    <FontAwesomeIcon icon={faBriefcase} />
                    <span className="profile-info-desc-item-desc">Không có nơi làm việc.</span>
                </li>
                <li className="profile-info-desc-item">

                </li>
                <li className="profile-info-desc-item">

                </li>
                <li className="profile-info-desc-item">

                </li>
            </ul>
        </>

    );
}
