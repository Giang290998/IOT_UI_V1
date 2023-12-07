import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import notificationAPI from "../services/notificationAPI";

const SensorSlice = createSlice({
    name: "sensor",
    initialState:{
        status: 'idle',
        RT_temp: { data: [], time: [] },
        RT_pH: { data: [], time: [] },
        RT_concentration: { data: [], time: [] },
        RT_water: { data: [], time: [] },
        
        temp: { data: [], time: [] },
        pH: { data: [], time: [] },
        concentration: { data: [], time: [] },
        water: { data: [], time: [] },
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
            let new_RT_water = { data: [ ...state.RT_water.data, new_data[3] ], time: [ ...state.RT_water.time, timestamp ]}

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

            state.temp = { data: [], time: [] } ;
            state.pH = { data: [], time: [] } ;
            state.concentration = { data: [], time: [] } ;
            state.water = { data: [], time: [] } ;
        },
    },
    extraReducers: builder => {
        builder.addCase(getSensor.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(getSensor.fulfilled, (state, action) => {
            state.status = 'OK'
            state.friendRequest = action.payload.allFriendRequest
        })
        builder.addCase(getSensor.rejected, (state) => {
            state.status = 'failed'
        })
    }
})

export const getSensor = createAsyncThunk('Sensor/getSensor', async (userId) => {
    try {
        // const res = await SensorAPI.getSensor(userId)
        // return res.data
    } catch (error) {
        throw new Error(error)
    }
})
export const { updateRealTimeData, deleteSensorStore } = SensorSlice.actions;
export default SensorSlice.reducer;

const formatNumber = (num) => (num < 10 ? `0${num}` : num);