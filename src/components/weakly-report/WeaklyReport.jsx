import LineChart from "../line-chart/LineChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTemperatureThreeQuarters, faWandMagicSparkles, faFlaskVial, faDroplet } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { memo } from "react";
const ExcelJS = require('exceljs');

function WeaklyReport() {
    const temp = useSelector(state => state.sensor.temp);
    const pH = useSelector(state => state.sensor.pH);
    const concentration = useSelector(state => state.sensor.concentration);
    const water = useSelector(state => state.sensor.water);

    const sensor_data = useSelector(state => state.sensor.sensor_data);

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

        for (let i = 0; i < sensor_data.length; i++) {
            let data_insert = [sensor_data[i].time, ...sensor_data[i].data];
            data.push(data_insert);
        }
        exportToExcel(data, "sensor", `REPORT_${GetCurrentDate()}.xlsx`)
    }

    return (
        <div>
            <div
                className="btn btn--primary btn-excel-download" onClick={() => HandleExportExcel()}
                style={{ backgroundColor: 'rgb(0, 136, 255)', width: '100%', height: '40px', fontSize: '20px' }}
            >Tải xuống file EXCEL</div>
            <LineChart
                data={temp.data} label={temp.time} avg={temp.avg}
                borderColor={"blue"} icon={<FontAwesomeIcon icon={faTemperatureThreeQuarters} />}
                icon_color={'blue'} icon_size={'30px'} title={'Nhiệt độ'} title_size={'14px'}
                title_weight={400} content={'28 °C'} content_size={'24px'} content_weight={500}
            />
            <LineChart
                data={pH.data} label={pH.time} avg={pH.avg}
                borderColor={"red"} icon={<FontAwesomeIcon icon={faWandMagicSparkles} />}
                icon_color={'red'} icon_size={'30px'} title={'pH'} title_size={'14px'}
                title_weight={400} content={'28 °C'} content_size={'24px'} content_weight={500}
            />
            <LineChart
                data={concentration.data} label={concentration.time} avg={concentration.avg}
                borderColor={"green"} icon={<FontAwesomeIcon icon={faFlaskVial} />}
                icon_color={'green'} icon_size={'30px'} title={'Nồng độ chất tan'} title_size={'14px'}
                title_weight={400} content={'28 °C'} content_size={'24px'} content_weight={500}
            />
            <LineChart
                data={water.data} label={water.time} avg={water.avg}
                borderColor={"purple"} icon={<FontAwesomeIcon icon={faDroplet} />}
                icon_color={'purple'} icon_size={'30px'} title={'Mực nước'} title_size={'14px'}
                title_weight={400} content={'28 °C'} content_size={'24px'} content_weight={500}
            />
        </div>
    );
};

export default memo(WeaklyReport);