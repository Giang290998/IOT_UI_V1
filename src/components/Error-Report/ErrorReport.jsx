import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPen, faCircleUp, faCircleDown, faCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import './error-report.scss';
// import TextInput from '../text-input/TextInput'
// import { useState } from 'react';
// import { CircularProgress } from 'react-cssfx-loading/lib';
// import defaultAvatar from '../../assets/defaultAvatar.png';

function ErrorReport() {
    // const $ = document.querySelector.bind(document);
    // const $$ = document.querySelectorAll.bind(document);
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : '';

    const alarm = useSelector(state => state.sensor.alarm);


    return (
        <div className="manager">
            <div class={"table-container" + themeMode}>
                <table>
                    <thead>
                        <tr>
                            <th>Số thứ tự</th>
                            <th>Thiết bị</th>
                            <th>Nguyên nhân</th>
                            <th>Ghi chú</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            alarm.map((item, index) =>
                                <tr key={index}>
                                    <td>
                                        <p className="column-content">{index + 1}</p>
                                    </td>
                                    <td>
                                        <p className="column-content">{item.device}</p>
                                    </td>
                                    <td>
                                        <p className="column-content">{item.reason}</p>
                                    </td>
                                    <td>
                                        <p className="column-content">{item.message}</p>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ErrorReport;