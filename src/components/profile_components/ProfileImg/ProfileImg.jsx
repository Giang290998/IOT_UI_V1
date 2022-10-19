import React from 'react';
import './profile_img.scss';
import Footer from '../../footer-information/Footer';
import { useSelector } from 'react-redux';

export default function ProfileImg({ userInfo }) {
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : '';
    const allImage = userInfo.image ? JSON.parse(userInfo.image) : null
    return (
        <div className={"wrap-profile-img"+themeMode}>
            <div className="col l-12 profile-img">
                <h2 className="profile-img-title">Ảnh</h2>
                <ul className="profile-img-wrapper">
                    {
                        allImage
                        ?
                        allImage.map((image, index) =>
                            <li key={index} className="col l-3 profile-img-item">
                                <img src={image} alt="" className="user-storage-img" />
                            </li>
                        )
                        :
                        <h3 className="profile-img-empty">Không có ảnh nào.</h3>
                    }
                </ul>
            </div>
            <Footer />
        </div>
    )
}
