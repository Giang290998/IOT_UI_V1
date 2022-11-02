import userAPI from "../services/userAPI";
import { loginStart, saveUser, loginFailed, setFriendInfo, modifiedThemeMode, setWeather } from "./authSlice";
import { getAllMessage, setNoChatRoom } from "./chatSlice";
import { getNotification } from "./notificationSlice";
import { getAllPost } from "./postSlice";
import { setToast } from '../components/toast/ToastContainer';
import weatherAPI from "../services/weatherAPI";
import axios from "axios";
import store from "./store";

export const getInfoUser = async (user, dispatch) => {
    dispatch(loginStart())
    try {
        const res = await userAPI.loginUser(user)
        saveInfoUser(res.data)
    } catch (error) {
        dispatch(loginFailed())
    }
}

export const saveInfoUser = (data) => {
    const { errCode, message, ...info } = data
    const themeMode = localStorage.getItem('themeMode') ? localStorage.getItem('themeMode') : 'light'
    localStorage.setItem("rememberToken",`${info.rememberToken}`)
    store.dispatch(modifiedThemeMode(themeMode))
    store.dispatch(saveUser(info))
    store.dispatch(getNotification(info.userInformation.userId))
    store.dispatch(getAllPost(info.userInformation.userId))
    if (info.userInformation.chatRoom) {
        store.dispatch(getAllMessage(info.userInformation.chatRoom))
    } else {
        store.dispatch(setNoChatRoom())
    }
    if (info.friendInfo) {
        store.dispatch(setFriendInfo(info.friendInfo))
    }
    getWeatherInfo()
}

export async function getWeatherInfo() {
    try {        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                // Success function
                async (position) => {
                    const lat = round(position.coords.latitude, 4)
                    const lon = round(position.coords.longitude, 4)
                    const resp = await weatherAPI.getWeatherInfo({ lat, lon })
                    store.dispatch(setWeather(resp.data.weather))
                }, 
                // Error function
                async () => {
                    try {
                        const res = await axios.get('http://ip-api.com/json/')
                        if (res.data) {
                            const resp = await weatherAPI.getWeatherInfo({ lat: res.data.lat, lon: res.data.lon })
                            store.dispatch(setWeather(resp.data.weather))
                            setToast(
                                'Thời tiết',
                                'Có lỗi trong quá trình xác định vị trí hiện tại của bạn, '+
                                'thời tiết sẽ lấy vị trí nhà mạng bạn đang sử dụng. Bạn có thể tải lại trang để cập nhật lại chính xác vị trí.',
                                'warning',
                                10000,
                                store.getState().auth.themeMode === 'dark' ? true : false
                            )
                        }
                    } catch (error) {
                        const resp = await weatherAPI.getWeatherInfo({ lat: 10.8326, lon: 106.6581 }) //HCM city default
                        store.dispatch(setWeather(resp.data.weather))
                        setToast(
                            'Thời tiết',
                            'Có lỗi trong quá trình xác định vị trí hiện tại của bạn, thời tiết sẽ lấy vị trí nhà mạng bạn đang sử dụng.',
                            'warning',
                            8000,
                            store.getState().auth.themeMode === 'dark' ? true : false
                        )
                    }
                    
                }, 
                // Options. See MDN for details.
                {
                    enableHighAccuracy: true,
                    timeout: 4000,
                    maximumAge: 0
                }
            )
        } else {
            const res = await axios.get('http://ip-api.com/json/')
            const resp = await weatherAPI.getWeatherInfo({ lat: res.data.lat, lon: res.data.lon })
            store.dispatch(setWeather(resp.data.weather))
            setToast(
                'Thời tiết',
                'Có lỗi trong quá trình xác định vị trí hiện tại của bạn, thời tiết sẽ lấy vị trí nhà mạng bạn đang sử dụng.',
                'warning',
                8000,
                store.getState().auth.themeMode === 'dark' ? true : false
            )
        }
    } catch (error) {
        const resp = await weatherAPI.getWeatherInfo({ lat: 10.8326, lon: 106.6581 }) //HCM city default
        store.dispatch(setWeather(resp.data.weather))
        setToast(
            'Thời tiết',
            'Có lỗi trong quá trình xác định vị trí hiện tại của bạn, thời tiết sẽ lấy vị trí nhà mạng bạn đang sử dụng.',
            'warning',
            8000,
            store.getState().auth.themeMode === 'dark' ? true : false
        )
    }

    function round(value, precision) {
        const multiplier = Math.pow(10, precision || 0)
        return Math.round(value * multiplier) / multiplier
    }
}