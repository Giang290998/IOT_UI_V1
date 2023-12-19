import './leftbar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faNewspaper, faClock, faBell } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import store from '../../redux/store';
import { setPage } from '../../redux/authSlice';
import { memo, useEffect } from 'react';

function Leftbar() {
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : '';



    // let a;

    useEffect(() => {
        // const T = setInterval(() => {
        const listItemElements = document.querySelectorAll('li[id="iot-left-list"]');
        listItemElements.forEach((li, index) => {
            li.addEventListener('click', () => {
                store.dispatch(setPage(index));
                listItemElements.forEach((li2, ind) => {
                    if (index === ind) {
                        li2.classList.add("select")
                    } else {
                        li2.classList.remove("select")
                    }
                })
            });
        });
        // }, 500)

        // setTimeout(() => {
        //     clearInterval(T)
        // }, 2000)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function handleClickLeftList() {

    }


    return (
        <div className={"leftbar-wrapper disable-select " + themeMode}>
            {/* <Weather /> */}
            <ul className="leftbar-list">
                <li id="iot-left-list" className="leftbar-item select" onClick={() => handleClickLeftList()}>
                    <div className="leftbar-item-wapper">
                        <div className="icon-wapper">
                            <FontAwesomeIcon icon={faClock} className="icon star-icon" />
                        </div>
                        <span className="like-title">Dữ liệu hiện tại</span>
                    </div>
                </li>
                <li id="iot-left-list" className="leftbar-item">
                    <div className="leftbar-item-wapper leftbar-item-friend">
                        <div className="icon-wapper">
                            <FontAwesomeIcon icon={faNewspaper} className="icon friend-icon" />
                        </div>
                        <span className="friend-title">Báo cáo dữ liệu</span>
                    </div>
                </li>
                <li id="iot-left-list" className="leftbar-item">
                    <div className="leftbar-item-wapper leftbar-item-memories">
                        <div className="icon-wapper">
                            <FontAwesomeIcon icon={faBell} className="icon memories-icon" />
                        </div>
                        <span className="memories-title">Báo cáo lỗi</span>
                    </div>
                </li>
                <li id="iot-left-list" className="leftbar-item">
                    <div className="leftbar-item-wapper leftbar-item-group">
                        <div className="icon-wapper">
                            <FontAwesomeIcon icon={faUsers} className="icon group-icon" />
                        </div>
                        <span className="group-title">Quản lý nhân viên</span>
                    </div>
                </li>
            </ul>
        </div>
    );
}

export default memo(Leftbar);