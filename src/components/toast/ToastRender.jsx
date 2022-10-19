import React from 'react';
import './toast-render.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faCircleInfo, faCircleCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

export default function ToastRender({title, description, type, id, darkMode}) {
    const themeMode = darkMode ? ' dark' : '';
    function getIconToast(type) {
        switch (type) {
            case 'error':
            case 'warning':
                return faExclamationCircle
            case 'success':
                return faCircleCheck
            case 'notification':
                return faCircleInfo
            default:
                return faCircleInfo
        }
    }

    return (
        <div id={id} className={"toast " + type + themeMode}>
            <div className="toast-icon-wrap">
                <FontAwesomeIcon icon={getIconToast(type)} className={"toast-icon "+type}/>
            </div>
            <div className="toast-content">
                {
                    title && <h3 className="toast-content-title">{title}</h3>
                }
                <h3 className="toast-content-description">{description}</h3>
            </div>
            <div id={"toast-exit-"+id} className="toast-exit">
                <FontAwesomeIcon icon={faXmark} className="toast-exit-icon"/>
            </div>
        </div>
    )
}
