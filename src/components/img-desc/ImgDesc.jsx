import { memo } from 'react';
import './imgDesc.scss';
import defaultAvatar from '../../assets/defaultAvatar.png';
import { useSelector } from 'react-redux/es/hooks/useSelector';

function ImgDesc(props) {
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : '';
    return (
        <div className={"item-wrapper disable-select"+themeMode}>
            <div className="img-wrapper">
                <img src={props.img ? props.img : defaultAvatar} alt="" className="img" />
            </div>
            <span className="desc">{props.desc}</span>
        </div>
        
    )
}

export default memo(ImgDesc);