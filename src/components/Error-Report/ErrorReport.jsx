import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPen, faCircleUp, faCircleDown, faCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import './error-report.scss';
const ExcelJS = require('exceljs');
const moment = require('moment-timezone');

function ErrorReport() {
    // const $ = document.querySelector.bind(document);
    // const $$ = document.querySelectorAll.bind(document);
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : '';

    const alarm = useSelector(state => state.sensor.alarm);
    const device = useSelector(state => state.project.project_detail.device_name)

    async function exportToExcel(dataArray, sheetName, fileName) {
        // Create a new workbook
        const workbook = new ExcelJS.Workbook();

        // Add a worksheet
        const worksheet = workbook.addWorksheet(sheetName);

        // Populate the worksheet with data
        dataArray.forEach(row => {
            worksheet.addRow(row);
        });

        // Create a buffer with the Excel file content
        const buffer = await workbook.xlsx.writeBuffer();

        // Convert the buffer to a Blob
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // Create a download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;

        // Append the link to the body and trigger the download
        document.body.appendChild(link);
        link.click();

        // Remove the link from the body
        document.body.removeChild(link);
    }

    function GetCurrentDate() {
        // Tạo đối tượng Date hiện tại
        const currentDate = new Date();

        // Lấy thông tin về ngày, tháng, năm, giờ, phút, giây
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0, nên cần cộng thêm 1
        const day = currentDate.getDate();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const seconds = currentDate.getSeconds();

        // Tạo chuỗi định dạng ngày tháng năm giờ phút giây
        const formattedDate = `${year}-${padNumber(month)}-${padNumber(day)} ${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}`;

        // In ra chuỗi kết quả
        return formattedDate;
    }

    function padNumber(num) {
        return num < 10 ? `0${num}` : num;
    }

    function HandleExportErrorToExcel() {
        const data = [
            ["STT", "Thiết bị", "Nguyên nhân", "Thời gian"]
        ];

        for (let i = 0; i < alarm.length; i++) {
            let data_insert = [i + 1, device[alarm[i].device], alarm[i].reason, moment(alarm[i].time).format("YYYY:MM:DD HH:mm:ss")];
            data.push(data_insert);
        }
        exportToExcel(data, "sensor", `REPORT_${GetCurrentDate()}.xlsx`)
    }


    return (
        <div className="manager">
            <div
                className="btn btn--primary btn-excel-download" onClick={() => HandleExportErrorToExcel()}
                style={{ backgroundColor: 'rgb(0, 136, 255)', width: '100%', height: '40px', fontSize: '20px', marginBottom: '20px' }}
            >Tải xuống file EXCEL</div>
            <div class={"table-container" + themeMode}>
                <table>
                    <thead>
                        <tr>
                            <th>Số thứ tự</th>
                            <th>Thiết bị</th>
                            <th>Nguyên nhân</th>
                            <th>Thời gian</th>
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
                                        <p className="column-content">{device[item.device]}</p>
                                    </td>
                                    <td>
                                        <p className="column-content">{item.reason}</p>
                                    </td>
                                    <td>
                                        <p className="column-content">{moment(item.time).format("YYYY:MM:DD HH:mm:ss")}</p>
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