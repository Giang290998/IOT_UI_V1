import React from 'react'
import './profile.scss'
import Topbar from '../../components/topbar/Topbar'
import ProfilePosted from '../../components/profile_components/ProfilePosted/ProfilePosted'
import { Link } from 'react-router-dom'

export default function ProfilePostedUser() {
    return (
        
        <>
            <div className="grid profile-user-topbar">
                <div className="row profile-topbar">
                    <Topbar />
                </div> 
            </div>
            <div className="wrapper">
                <div className="grid wide profile-content">
                    <div className="row">
                        <div className="col l-12">
                            <img src="https://scontent.fsgn2-5.fna.fbcdn.net/v/t31.18172-8/21122410_2014924618739538_6588300267320208586_o.jpg?_nc_cat=104&ccb=1-5&_nc_sid=e3f864&_nc_ohc=eVVpeaZ5zdsAX9tIj8f&_nc_ht=scontent.fsgn2-5.fna&oh=00_AT-7XxGzlHsfVQdkXlf9H_6f_7v5wiFfcRCYbAMo9uirDQ&oe=6289AF85" alt="" className="cover-img"/>
                        </div>
                    </div>
                    <div className="row row-user">
                        <div className="col l-12">
                            <div className="user-wrapper">
                                <img src="https://scontent.fsgn2-5.fna.fbcdn.net/v/t1.6435-9/51720751_2329241893974474_4639137791526043648_n.jpg?_nc_cat=102&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=d_i0WHNukVYAX--5eac&_nc_ht=scontent.fsgn2-5.fna&oh=00_AT80QYZByOrWHXkQBrhhZweOJURB5gXTlgFd7kXU-NK2dw&oe=628A5F10" alt="" className="user-img" />
                                <span className="user-full-name">Nguyễn Hoàng Giang</span>
                            </div>
                            <ul className="user-nav">
                                <Link to="/profile" >
                                    <li className="user-nav-item">
                                        <span className="item-title">Bài viết</span>
                                    </li>
                                </Link>
                                <Link to="/profile/introduce">
                                    <li className="user-nav-item">
                                        <span className="item-title">Giới thiệu</span>
                                    </li>
                                </Link>
                                <Link to="/profile/friends">
                                    <li className="user-nav-item">
                                        <span className="item-title">Bạn bè</span>
                                    </li>
                                </Link>
                                <Link to="/profile/image">
                                    <li className="user-nav-item">
                                        <span className="item-title">Ảnh</span>
                                    </li>
                                </Link>
                            </ul>
                        </div>
                        <ProfilePosted/>
                    </div> 
                </div>
            </div>
        </>

    )
}


