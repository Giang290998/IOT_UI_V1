import LineChart from "../line-chart/LineChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTemperatureThreeQuarters, faWandMagicSparkles, faFlaskVial, faDroplet, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { memo, useState } from "react";
import "./weaklyreport.scss";
import { setToast } from "../toast/ToastContainer";
const ExcelJS = require('exceljs');
const moment = require('moment-timezone');

function WeaklyReport() {
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : '';

    const temp = useSelector(state => state.sensor.temp);
    const pH = useSelector(state => state.sensor.pH);
    const concentration = useSelector(state => state.sensor.concentration);
    const water = useSelector(state => state.sensor.water);
    const sensor_data = useSelector(state => state.sensor.sensor_data);

    const [tempFilter, setTempFilter] = useState(filterRecentDays(temp, 1));
    const [pHFilter, setPHFilter] = useState(filterRecentDays(pH, 1));
    const [concentrationFilter, setConcentrationFilter] = useState(filterRecentDays(concentration, 1));
    const [waterFilter, setWaterFilter] = useState(filterRecentDays(water, 1));

    const [dayFilter, setDayFilter] = useState(1);

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

    function HandleExportExcel() {
        const data = [
            ["Thời gian", "Nhiệt độ", "pH", "Nồng độ chất tan", "Mực nước"]
        ];

        if (tempFilter.data.length === 0) {
            setToast(
                null,
                "Không có dữ liệu để tải xuống!",
                "warning",
                3000,
                themeMode === ' dark' ? true : false
            )
            return;
        }

        for (let i = 0; i < tempFilter.data.length; i++) {
            let data_insert = [sensor_data[i].time, tempFilter.data[i], pHFilter.data[i], concentrationFilter.data[i], waterFilter.data[i]];
            data.push(data_insert);
        }
        exportToExcel(data, "sensor", `REPORT_${GetCurrentDate()}.xlsx`)
    }

    function filterRecentDays(sensor, days) {
        const currentDate = moment().valueOf();
        let sensor_filter = { ...sensor, data: [], time: [] };
        for (let i = 0; i < sensor.time.length; i++) {
            if (sensor.time[i] + days * 86400000 > currentDate) {
                sensor_filter.data.push(sensor.data[i]);
                sensor_filter.time.push(sensor.time[i]);
            }
        }
        sensor_filter.time = convertTimeFormatArr(sensor_filter.time);
        sensor_filter.avg = calculateAverage(sensor_filter.data);
        return sensor_filter;
    }

    function handleFilterSensorData(day) {
        setDayFilter(day);
        setTempFilter(filterRecentDays(temp, day));
        setPHFilter(filterRecentDays(pH, day));
        setConcentrationFilter(filterRecentDays(concentration, day));
        setWaterFilter(filterRecentDays(water, day));
    }

    function convertTimeFormatArr(originalTimeStringArr) {
        if (originalTimeStringArr.length === 0) return;

        let formattedStringTime = [];
        for (let i = 0; i < originalTimeStringArr.length; i++) {
            // Tạo đối tượng Moment từ chuỗi thời gian ban đầu
            const originalMoment = moment(originalTimeStringArr[i]);

            // Chuyển đổi sang múi giờ GMT+7
            const gmt7Moment = originalMoment.tz('Asia/Ho_Chi_Minh');

            // Lấy thông tin ngày, giờ, phút và giây từ đối tượng Moment
            const day = gmt7Moment.date();
            const hours = gmt7Moment.hours();
            const minutes = gmt7Moment.minutes();
            const seconds = gmt7Moment.seconds();

            // Định dạng lại chuỗi theo định dạng mong muốn
            const formattedString = `${formatNumber(day)} - ${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`;

            formattedStringTime.push(formattedString);
        }
        return formattedStringTime;
    }

    function formatNumber(num) {
        return num < 10 ? `0${num}` : num;
    }

    function calculateAverage(array) {
        // Lọc ra các phần tử không phải null hoặc undefined
        const filteredArray = array.filter(element => element !== null && element !== undefined);

        // Kiểm tra xem mảng có phần tử không
        if (filteredArray.length === 0) {
            return 0; // Trả về 0 nếu mảng sau khi lọc không còn phần tử để tránh chia cho 0
        }

        // Chuyển đổi chuỗi thành số và tính tổng
        const sum = filteredArray.reduce((acc, current) => acc + parseFloat(current), 0);

        // Tính trung bình cộng
        const average = sum / filteredArray.length;

        return average;
    }

    return (
        <div>
            <div className="wrap-btn-weakly-report"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '10px' }}
            >
                <label class="dropdown disable-select"
                >
                    <div class="dd-button disable-select">
                        {
                            `${dayFilter} ngày trước`
                        }
                    </div>
                    <input type="checkbox" class="dd-input" id="test" />
                    <ul class="dd-menu disable-select">
                        <li
                            onClick={() => handleFilterSensorData(1)}
                        >1 ngày trước</li>
                        <li
                            onClick={() => handleFilterSensorData(3)}
                        >3 ngày trước</li>
                        <li
                            onClick={() => handleFilterSensorData(7)}
                        >7 ngày trước</li>
                        <li
                            onClick={() => handleFilterSensorData(14)}
                        >14 ngày trước</li>
                        <li
                            onClick={() => handleFilterSensorData(30)}
                        >30 ngày trước</li>
                        <li class="divider"></li>
                        {/* <li>
                            <a href="http://rane.io">Link to Rane.io</a>
                        </li> */}
                    </ul>

                </label>
                <div
                    className="btn btn--primary btn-excel-download" onClick={() => HandleExportExcel()}
                    style={{ backgroundColor: 'rgb(0, 136, 255)', width: '30%', height: '40px', fontSize: '20px' }}
                >
                    <FontAwesomeIcon icon={faArrowDown} style={{ marginRight: '8px' }} />
                    {
                        `Tải xuống EXCEL (${dayFilter} ngày)`
                    }
                </div>
            </div>

            <LineChart
                data={tempFilter.data} label={tempFilter.time} avg={tempFilter.avg}
                borderColor={"blue"} icon={<FontAwesomeIcon icon={faTemperatureThreeQuarters} />}
                icon_color={'blue'} icon_size={'30px'} title={'Nhiệt độ'} title_size={'14px'}
                title_weight={400} content={'28 °C'} content_size={'24px'} content_weight={500}
            />
            <LineChart
                data={pHFilter.data} label={pHFilter.time} avg={pHFilter.avg}
                borderColor={"red"} icon={<FontAwesomeIcon icon={faWandMagicSparkles} />}
                icon_color={'red'} icon_size={'30px'} title={'pH'} title_size={'14px'}
                title_weight={400} content={'28 °C'} content_size={'24px'} content_weight={500}
            />
            <LineChart
                data={concentrationFilter.data} label={concentrationFilter.time} avg={concentrationFilter.avg}
                borderColor={"green"} icon={<FontAwesomeIcon icon={faFlaskVial} />}
                icon_color={'green'} icon_size={'30px'} title={'Nồng độ chất tan'} title_size={'14px'}
                title_weight={400} content={'28 °C'} content_size={'24px'} content_weight={500}
            />
            <LineChart
                data={waterFilter.data} label={waterFilter.time} avg={waterFilter.avg}
                borderColor={"purple"} icon={<FontAwesomeIcon icon={faDroplet} />}
                icon_color={'purple'} icon_size={'30px'} title={'Mực nước'} title_size={'14px'}
                title_weight={400} content={'28 °C'} content_size={'24px'} content_weight={500}
            />
        </div>
    );
};

export default memo(WeaklyReport);