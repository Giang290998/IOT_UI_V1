import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import DeviceDataAPI from "../services/deviceDataAPI";
const moment = require('moment-timezone');

const SensorSlice = createSlice({
    name: "sensor",
    initialState:{
        status: 'idle',
        RT_temp: { data: [], time: [] },
        RT_pH: { data: [], time: [] },
        RT_concentration: { data: [], time: [] },
        RT_water: { data: [], time: [] },
        
        temp: { data: [], time: [], avg: null },
        pH: { data: [], time: [], avg: null },
        concentration: { data: [], time: [], avg: null },
        water: { data: [], time: [], avg: null },

        sensor_data: null,

        alarm: null,
    },
    reducers:{
        updateRealTimeData: (state, action) => {
            const new_data = [ ...action.payload ];
            const now = new Date();
            const hours = formatNumber(now.getHours());
            const minutes = formatNumber(now.getMinutes());
            const seconds = formatNumber(now.getSeconds());
            const timestamp = `${hours}:${minutes}:${seconds}`;

            let new_RT_temp = { data: [ ...state.RT_temp.data, new_data[0] ], time: [ ...state.RT_temp.time, timestamp ]}
            let new_RT_concentration = { data: [ ...state.RT_concentration.data, new_data[1] ], time: [ ...state.RT_concentration.time, timestamp ]}
            let new_RT_pH = { data: [ ...state.RT_pH.data, new_data[2] ], time: [ ...state.RT_pH.time, timestamp ]}
            let new_RT_water = { data: [ ...state.RT_water.data, (new_data[3] > 0 ? new_data[3] : 0) ], time: [ ...state.RT_water.time, timestamp ]}

            state.RT_temp.data = new_RT_temp.data.slice(-30);
            state.RT_temp.time = new_RT_temp.time.slice(-30);
            state.RT_pH.data = new_RT_pH.data.slice(-30);
            state.RT_pH.time = new_RT_pH.time.slice(-30);
            state.RT_concentration.data = new_RT_concentration.data.slice(-30);
            state.RT_concentration.time = new_RT_concentration.time.slice(-30);
            state.RT_water.data = new_RT_water.data.slice(-30);
            state.RT_water.time = new_RT_water.time.slice(-30);
        },
        deleteSensorStore: (state) => {
            state.status = 'idle'
            
            state.RT_temp = { data: [], time: [] } ;
            state.RT_pH = { data: [], time: [] } ;
            state.RT_concentration = { data: [], time: [] } ;
            state.RT_water = { data: [], time: [] } ;

            state.temp = { data: [], time: [], avg: null };
            state.pH = { data: [], time: [], avg: null };
            state.concentration = { data: [], time: [], avg: null };
            state.water = { data: [], time: [], avg: null };
        },
    },
    extraReducers: builder => {
        builder.addCase(GetAllDeviceData.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(GetAllDeviceData.fulfilled, (state, action) => {
            state.status = 'OK'
            let data = action.payload;
            
            if (data) {
                const sortByTime = (a, b) => a.time - b.time;
                let sensor_data = data.sort(sortByTime);
                state.sensor_data = sensor_data;

                let data_temp = [];
                let data_pH = [];
                let data_concentration = [];
                let data_water = [];
                let data_time = [];
                for (let i = 0; i < sensor_data.length; i++) {
                    data_temp.push(sensor_data[i].data[0]);
                    data_concentration.push(sensor_data[i].data[1]);
                    data_pH.push(sensor_data[i].data[2]);
                    data_water.push(sensor_data[i].data[3]);
                    data_time.push(convertTimeFormat(sensor_data[i].time));
                }

                state.temp = { data: data_temp, time: data_time, avg: calculateAverage(data_temp) }
                state.pH = { data: data_pH, time: data_time, avg: calculateAverage(data_pH) }
                state.concentration = { data: data_concentration, time: data_time, avg: calculateAverage(data_concentration) }
                state.water = { data: data_water, time: data_time, avg: calculateAverage(data_water) }
            }
        })
        builder.addCase(GetAllDeviceData.rejected, (state) => {
            state.status = 'failed'
        })

        builder.addCase(GetAllAlarm.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(GetAllAlarm.fulfilled, (state, action) => {
            state.status = 'OK'
            let alarm_sort = bubbleSortAlarm(action.payload);
            state.alarm = alarm_sort;
        })
        builder.addCase(GetAllAlarm.rejected, (state) => {
            state.status = 'failed'
        })
    }
})

export const GetAllDeviceData = createAsyncThunk('Sensor/getAll', async () => {
    try {
        const res = await DeviceDataAPI.GetAllDeviceData();
        return res.data
    } catch (error) {
        console.log(error)
    }
})
export const GetAllAlarm = createAsyncThunk('Alarm/getAll', async () => {
    try {
        const res = await DeviceDataAPI.GetAllAlarm();
        return res.data
    } catch (error) {
        console.log(error)
    }
})
export const { updateRealTimeData, deleteSensorStore } = SensorSlice.actions;
export default SensorSlice.reducer;

const formatNumber = (num) => (num < 10 ? `0${num}` : num);

function convertTimeFormat(originalTimeString) {
    // Tạo đối tượng Moment từ chuỗi thời gian ban đầu
    const originalMoment = moment(originalTimeString);
  
    // Chuyển đổi sang múi giờ GMT+7
    const gmt7Moment = originalMoment.tz('Asia/Ho_Chi_Minh');
  
    // Lấy thông tin ngày, giờ, phút và giây từ đối tượng Moment
    const day = gmt7Moment.date();
    const hours = gmt7Moment.hours();
    const minutes = gmt7Moment.minutes();
    const seconds = gmt7Moment.seconds();
  
    // Định dạng lại chuỗi theo định dạng mong muốn
    const formattedString = `${formatNumber(day)} - ${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`;
  
    return formattedString;
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

function bubbleSortAlarm(arr) {
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            // So sánh các phần tử liên tiếp và hoán đổi chúng nếu chúng không đúng thứ tự
            if (moment(arr[j].time).valueOf() > moment(arr[j + 1].time).valueOf()) {
                // Hoán đổi
                const temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }

    return arr;
}
  