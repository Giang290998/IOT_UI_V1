import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { memo, useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import './linechart.scss';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function RealTimeLineChart(
    {
        data, title_size, title_weight, title, icon, icon_color, icon_size, unit, max_y_axis,
        label, content_size, content_weight, content_padding_left, borderColor
    }
) {
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : '';
    const [chartData, setChartData] = useState({
        labels: label,
        datasets: [
            {
                label: unit ? unit : "",
                data: data,
                borderColor: borderColor,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ],
    });

    useEffect(() => {
        setChartData({
            labels: label,
            datasets: [
                {
                    ...chartData.datasets[0],
                    data: data,
                }
            ],
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: max_y_axis ? max_y_axis : null,
            },
        },
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
                    }}>
                        {
                            data[data.length - 1] ? parseFloat(data[data.length - 1]) : "--"
                                + " " +
                                (unit ? unit : "")
                        }
                    </p>
                </span>
            </div>
            <Line options={options} data={chartData} />
        </div>
    )
}

export default memo(RealTimeLineChart);
