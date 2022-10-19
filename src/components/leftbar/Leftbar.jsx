import './leftbar.scss';
import Weather from '../weather/Weather';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup, faUsers, faClockRotateLeft, faStar } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

export default function Leftbar() {
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : '';
    
    return (
        <div className={"leftbar-wrapper disable-select "+themeMode}> 
            <Weather />
            <ul className="leftbar-list">
                <li className="leftbar-item">
                    <div className="leftbar-item-wapper leftbar-item-friend">
                        <div className="icon-wapper">
                            <FontAwesomeIcon icon={faUserGroup} className="icon friend-icon"/>
                        </div>
                        <span className="friend-title">Bạn bè</span>
                    </div>
                </li>
                <li className="leftbar-item">
                    <div className="leftbar-item-wapper leftbar-item-group">
                        <div className="icon-wapper">
                            <FontAwesomeIcon icon={faUsers} className="icon group-icon"/>
                        </div>
                        <span className="group-title">Nhóm</span>
                    </div>
                </li>
                <li className="leftbar-item">
                    <div className="leftbar-item-wapper leftbar-item-memories">
                        <div className="icon-wapper">
                            <FontAwesomeIcon icon={faClockRotateLeft} className="icon memories-icon"/>
                        </div>
                        <span className="memories-title">Kỷ niệm</span>
                    </div>
                </li>
                <li className="leftbar-item">
                    <div className="leftbar-item-wapper">
                        <div className="icon-wapper">
                            <FontAwesomeIcon icon={faStar} className="icon star-icon"/>
                        </div>
                        <span className="like-title">Yêu thích</span>
                    </div>
                </li>
            </ul>
        </div>
    );
}

