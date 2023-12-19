import axiosClient from "./axiosClient";

const DeviceDataAPI = {
    GetAllDeviceData : () => {
        const url = '/project/device-data?project_id=1'
        return axiosClient.get(url)
    },
    GetAllAlarm : () => {
        const url = '/project/alarm?project_id=1'
        return axiosClient.get(url)
    },
}

export default DeviceDataAPI;
