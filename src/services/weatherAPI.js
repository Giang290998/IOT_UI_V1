import axiosClient from "./axiosClient";

const weatherAPI = {
    getWeatherInfo : ({lat, lon}) => {
        const url = `/weather/get/${lat}/${lon}`
        return axiosClient.get(url)
    },
}

export default weatherAPI;
