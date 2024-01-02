import { memo } from 'react';
import './footer-information.scss';
import { useSelector } from 'react-redux';
const moment = require('moment-timezone');

function Footer() {
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : '';
    return (
        <div className={"gsocial-footer-wrap" + themeMode}>
            <p className="gsocial-footer privacy">Quyền riêng tư</p>
            <span className="gsocial-footer-dot">&nbsp;-&nbsp;</span>
            <p className="gsocial-footer rules">Điều khoản</p>
            <span className="gsocial-footer-dot">&nbsp;-&nbsp;</span>
            <p className="gsocial-footer copy-right">
                {
                    `AgriIOT © ${moment().year()}`
                }
            </p>
        </div>
    )
}
export default memo(Footer);
