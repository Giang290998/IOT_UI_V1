import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPen, faCircleUp, faCircleDown, faCircleXmark, faCirclePlus, faXmark, faMagnifyingGlass
} from '@fortawesome/free-solid-svg-icons';
import './manager.scss';
import { useSelector } from 'react-redux';
import TextInput from '../text-input/TextInput'
import { useEffect, useState } from 'react';
import { CircularProgress } from 'react-cssfx-loading/lib';
import defaultAvatar from '../../assets/defaultAvatar.png';

function Manager() {
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : '';
    const [waitingResponseSearchNewStaff, setWaitingResponseSearchNewStaff] = useState(false);
    const staff = [
        {
            name: "Đoàn Thị Hồng Hạnh",
            level: "Quản lý",
            phone: "0326118999"
        },
        {
            name: "Đoàn Thị Mi Mi",
            level: "Nhân viên",
            phone: "0326118999"
        },
        {
            name: "Đoàn Thị Hồng Hạnh",
            level: "Quản lý",
            phone: "0326118999"
        },
        {
            name: "Đoàn Thị Mi Mi",
            level: "Nhân viên",
            phone: "0326118999"
        }
    ]

    useEffect(() => {
        const button = $$('div[id="manager-action-btn"]');
        const dropDown = $$('ul[id="action-list"]');

        button.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                dropDown.forEach((ul, ind) => {
                    if (index === ind) {
                        if (ul.classList.contains("visible")) {
                            ul.classList.remove("visible")
                        } else {
                            ul.classList.add("visible")
                        }
                    } else {
                        ul.classList.remove("visible")
                    }
                })
            });
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function exitAddStaffModal() {
        const addStaffModal = $('div[id="add-staff-modal"]');
        addStaffModal.classList.add("hidden");
    }

    function viewAddStaffModal() {
        const addStaffModal = $('div[id="add-staff-modal"]');
        addStaffModal.classList.remove("hidden");
    }


    return (
        <div className="manager">
            <div class={"table-container" + themeMode}>
                <table>
                    <thead>
                        <tr>
                            <th>Số thứ tự</th>
                            <th>Họ và Tên</th>
                            <th>Số Điện Thoại</th>
                            <th>Chức Vụ</th>
                            <th>Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            staff.map((item, index) =>
                                <tr key={index}>
                                    <td>
                                        <p className="column-content">{index + 1}</p>
                                    </td>
                                    <td>
                                        <p className="column-content">{item.name}</p>
                                    </td>
                                    <td>
                                        <p className="column-content">{item.phone}</p>
                                    </td>
                                    <td>
                                        <p className="column-content">{item.level}</p>
                                    </td>
                                    <td>
                                        <div id="manager-action-btn" className="btn action-btn">
                                            <FontAwesomeIcon icon={faPen} className="action-btn-icon" />
                                        </div>
                                        <ul id="action-list" className="action-list">
                                            <li className="action-item promote">
                                                <FontAwesomeIcon icon={faCircleUp} className="action-icon promote" />
                                                <p className="action-title">Tăng 1 cấp</p>
                                            </li>
                                            <li className="action-item demote">
                                                <FontAwesomeIcon icon={faCircleDown} className="action-icon demote" />
                                                <p className="action-title">Hạ 1 cấp</p>
                                            </li>
                                            <li className="action-item out">
                                                <FontAwesomeIcon icon={faCircleXmark} className="action-icon out" />
                                                <p className="action-title">Sa thải</p>
                                            </li>
                                        </ul>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
            <div
                id="add-staff-btn" className="btn btn--primary add-staff-btn disable-select"
                onClick={() => viewAddStaffModal()}
            >
                <FontAwesomeIcon icon={faCirclePlus} className="action-icon promote" />
                <p className="add-staff-btn-title">Thêm nhân viên</p>
            </div>
            <div id="add-staff-modal" className="modal hidden">
                <div className="modal__overlay">
                </div>
                <div className="modal__body">
                    {/* Register form */}
                    <div className="register disable-select">
                        <div className="register__container">
                            <div className="register-top">
                                <div className="register-title">
                                    <span className="main-title">Thêm nhân viên</span>
                                </div>
                                <div className="register-exit"
                                    onClick={() => exitAddStaffModal()}
                                >
                                    <FontAwesomeIcon icon={faXmark} className="exit-register-icon" />
                                </div>
                            </div>
                            <form className="register-contain">
                                <div className="create-account-wrapper">
                                    <TextInput
                                        type='text' placeholder='Số điện thoại' inputId="phone" title="Nhập số điện thoại"
                                    // errorStatus={errorStatusId}
                                    // onChange={handleChangeId}
                                    />
                                </div>
                                <div className="btn btn--primary search-staff">
                                    {
                                        waitingResponseSearchNewStaff
                                            ?
                                            <div className="wrap-spin-search">
                                                <CircularProgress color='#fff' />
                                            </div>
                                            :
                                            <>
                                                <FontAwesomeIcon icon={faMagnifyingGlass} className="search-staff-icon" />
                                                <p>Tìm kiếm</p>
                                            </>
                                    }

                                </div>
                                <div className="wrap-new-staff">
                                    <img src={defaultAvatar} alt="" className="new-staff-avatar" />
                                    <p className="new-staff-name">Đoàn Thị Hồng Hạnh</p>
                                    <div className="btn btn--primary add-staff">
                                        Thêm
                                    </div>
                                </div>
                                <div
                                    className="btn btn--primary"
                                    onClick={() => exitAddStaffModal()}
                                    style={{ height: '46px', fontSize: '18px', backgroundColor: 'rgb(47, 204, 47)' }}
                                >Thoát</div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Manager;