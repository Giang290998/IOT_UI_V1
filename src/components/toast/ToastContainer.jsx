import { memo } from 'react';
import './toast-container.scss';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import ToastRender from './ToastRender';

function ToastContainer() {
    return (
        <div id="toast-container"></div>
    )
}

export const setToast = (title, description, type, duration, darkMode) => {
    const id = uuidv4()
    const durationDefault = 3000
    const timeFadeIn = 200
    const timeFadeOut = 200
    const durationTime = duration ? duration : durationDefault
    const container = document.getElementById('toast-container')
    const autoRemoveTimeOut = setTimeout(() => {
        const toast = document.getElementById(`wrap-${id}`)
        container.removeChild(toast)
    }, (durationTime + timeFadeOut))
    const autoAddFadeOutAnimation = setTimeout(() => {
        const toast = document.getElementById(`${id}`)
        toast.style.animation = `fadeOut ${timeFadeOut}ms ease forwards`
    }, durationTime)

    const wrapToast = document.createElement('div')
    wrapToast.setAttribute('id', `wrap-${id}`)
    wrapToast.innerHTML =
    ReactDOMServer.renderToString(
        <ToastRender id={id} description={description} title={title} type={type} key={id} darkMode={darkMode}/>
    )
    container.appendChild(wrapToast)

    const toast = document.getElementById(`${id}`)
    toast.style.animation = `slideInRight ${timeFadeIn}ms ease`
    const exitToastButton = document.getElementById(`toast-exit-${id}`)
    exitToastButton.addEventListener('click', () => {
        const toast = document.getElementById(`${id}`)
        toast.style.animation = `fadeOut ${timeFadeOut}ms ease forwards`
        setTimeout(() => {
            const toastWrap = document.getElementById(`wrap-${id}`)
            container.removeChild(toastWrap)
        }, (timeFadeOut))
        clearTimeout(autoRemoveTimeOut)
        clearTimeout(autoAddFadeOutAnimation)
    })
}

setToast.PropTypes = {
    type: PropTypes.oneOf(['error', 'warning', 'success', 'notification']).isRequired,
    description: PropTypes.string.isRequired,
    title: PropTypes.string,
    darkMode: PropTypes.bool,
    duration: PropTypes.number,
}

export default memo(ToastContainer);


