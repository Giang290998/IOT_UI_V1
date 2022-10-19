/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './text-input.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

function TextInput({ inputId, type, title, placeholder, onChange, onKeyDown, onBlur, errorStatus, warningStatus}) {
    const $ = document.querySelector.bind(document)
    const [inputValue, setInputValue] = useState()
    const id = inputId ? inputId : title ? title : placeholder

    const errorInput = useCallback((errorStatus) => {
        let Border = $(`input[id="${id}"]`)
        let textDesc = $(`p[id="${id}-description-input"]`)
        let iconWaring = $(`svg[id="icon-warning-input-${id}"]`)
        Border.classList.add('error')
        textDesc.classList.add('error')
        textDesc.innerHTML = `${errorStatus}`
        iconWaring.classList.add('error')
        iconWaring.classList.remove('hidden')
    }, [])
    const warningInput = useCallback((warningStatus) => {
        let Border = $(`input[id="${id}"]`)
        let textDesc = $(`p[id="${id}-description-input"]`)
        Border.classList.add('warning')
        textDesc.classList.add('warning')
        textDesc.innerHTML = `${warningStatus}`
    }, [])
    const nullTextDesc = useCallback(() => {
        let Border = $(`input[id="${id}"]`)
        let textDesc = $(`p[id="${id}-description-input"]`)
        let iconWaring = $(`svg[id="icon-warning-input-${id}"]`)
        Border.classList.remove('error', 'warning')
        textDesc.classList.remove('error', 'warning')
        textDesc.innerHTML = `&nbsp;`
        iconWaring.classList.remove('error', 'warning')
        iconWaring.classList.add('hidden')
    }, [])

    useEffect(() => {
        if (errorStatus || warningStatus) {
            errorStatus
                ? errorInput(errorStatus)
                : warningInput(warningStatus)
        } else {
            nullTextDesc()
        }
    })

    function handleLengthInput(event) {
        const value = event.target.value
        setInputValue(value)
        onChange(event)
        let border = $(`input[id="${id}"]`)
        let textDesc = $(`p[id="${id}-description-input"]`)
        let iconWaring = $(`svg[id="icon-warning-input-${id}"]`)
        if (value) {
            border.classList.remove('error')
            textDesc.classList.remove('error')
            iconWaring.classList.remove('error')
            if (!border.classList.contains('warning')) {
                iconWaring.classList.add('hidden')
                textDesc.innerHTML = '&nbsp;'
            }
        }
    }
    function handleBlurInput(event) {
        let border = $(`input[id="${id}"]`)
        let textDesc = $(`p[id="${id}-description-input"]`)
        let iconWaring = $(`svg[id="icon-warning-input-${id}"]`)
        if (onBlur) {
            onBlur(event)
        }
        if(!inputValue) {
            border.classList.remove('warning')
            border.classList.add('error')
            textDesc.classList.remove('warning')
            textDesc.classList.add('error')
            textDesc.innerHTML = `${ title ? title : placeholder ? placeholder : "Miền này" } không được bỏ trống!`
            iconWaring.classList.remove('warning')
            iconWaring.classList.add('error')
            iconWaring.classList.remove('hidden')
        }
    }

    return (
        <div className="text-input-medium">
            {
                title && <p className="input-title">{title}</p>
            }
            <div className="wrapper-input">
                <input 
                    id={id} value={inputValue}
                    type={ type ? type : "text" } className="input"
                    placeholder={ placeholder ? placeholder : title ? title : null }
                    onChange={handleLengthInput}
                    onBlur={handleBlurInput}
                    onKeyDown={(event) => onKeyDown ? onKeyDown(event) : null }
                />
                <FontAwesomeIcon 
                    icon={faCircleExclamation} 
                    id={"icon-warning-input-"+id} 
                    className="icon hidden"
                />
            </div>
            <p id={id+"-description-input"} className="input-desc">&nbsp;</p>
        </div>
    )
}

TextInput.propTypes = {
    type: PropTypes.oneOf(['text', 'password']).isRequired,
    placeholder: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func,
    onBlur: PropTypes.func,
    title: PropTypes.string,
    errorStatus: PropTypes.string,
    warningStatus: PropTypes.string,
}

export default memo(TextInput);
