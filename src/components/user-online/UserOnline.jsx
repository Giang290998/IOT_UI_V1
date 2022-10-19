import { memo } from 'react';
import './userOnline.scss';
import defaultAvatar from '../../assets/defaultAvatar.png';
import { useSelector } from 'react-redux/es/hooks/useSelector';

function UserOnline(props) {
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : '';
    return (
        <div className={"item-user-wrapper disable-select"+themeMode}>
            <div className="img-user-wrapper">
                <img src={ props.img ? props.img : defaultAvatar } alt="" className="user-img" />
            </div>
            <span className="full-name">{props.desc}</span>
        </div>
    )
}

export default memo(UserOnline);
