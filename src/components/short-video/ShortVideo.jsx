import React from 'react';
import './short-video.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

export default function ShortVideo() {
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : ''
    return (
        <div className={"wrap-short-video"+themeMode}>
            <FontAwesomeIcon icon={faScrewdriverWrench} className="temp"/>
            <h2 className="temp-desc">Tính năng video ngắn hiện đang trong quá trình phát triển, chúng tôi sẽ cố gắng hoàn thành sớm nhất có thể.</h2>
        </div>
    )
}
