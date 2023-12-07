import { memo } from 'react';
import './imgDesc.scss';
import defaultAvatar from '../../assets/defaultAvatar.png';
import { useSelector } from 'react-redux';

function ImgDesc({ image, desc }) {
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : '';
    return (
        <div className={"item-wrapper disable-select" + themeMode}>
            <div className="img-wrapper">
                <img src={image ? image : defaultAvatar} alt="" className="img" />
            </div>
            <span className="desc">{desc}</span>
        </div>

    )
}

export default memo(ImgDesc);