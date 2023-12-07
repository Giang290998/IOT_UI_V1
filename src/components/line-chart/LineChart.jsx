import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './linechart.scss';
import { useSelector } from "react-redux";


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


function LineChart(
    { data, label, borderColor, backgroundColor, icon, icon_color, icon_size,
        title, content, title_size, title_weight, content_size, content_weight, content_padding_left }
) {

    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : '';

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            }
        },
    };

    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

    const dataSensor = [234, 324, 543, 345, 654, 678, 890]

    const dataObj = {
        labels,
        datasets: [
            {
                label: 'Dataset 1',
                data: dataSensor,
                borderColor: borderColor,
                backgroundColor: backgroundColor ?? 'rgba(255, 99, 132, 0.5)'
            },
        ],
    };

    return (
        <div className={"chart" + themeMode}>
            <p className="title" style={{ fontSize: title_size, fontWeight: title_weight }}>{title}</p>
            <div className="wrap-content" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                <div className="wrap-chart-icon" style={{ color: icon_color, fontSize: icon_size }}>
                    {icon}
                </div>
                <span className="wrap-chart-content">
                    <p className="content-chart" style={{
                        fontSize: content_size, fontWeight: content_weight,
                        paddingLeft: content_padding_left ?? '6px'
                    }}>{content}</p>
                </span>
            </div>
            <Line options={options} data={dataObj} />
        </div>
    )

}

export default LineChart;