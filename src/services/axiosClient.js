import axios from "axios";
import jwtDecode from "jwt-decode";
import { saveUser } from "../redux/authSlice";
import store from '../redux/store';

const BASE_URL = process.env.REACT_APP_BASE_URL_API
const axiosClient = axios.create({ 
    baseURL: BASE_URL,
    headers: {
        'content-type': 'application/json',
    },
    withCredentials: true,
})

axiosClient.interceptors.request.use(async (config) => {
    const user = store.getState().auth.login.user
    if (user) {
        const payloadAccessToken = jwtDecode(user.accessToken)
        const date = new Date()
        const time = date.getTime()/1000
        if (payloadAccessToken.exp < time) {
            const res = await getNewAccessToken(user.accessToken)
            if (res.data.errCode === 0) {
                const newUserInfo = {
                    ...user,
                    accessToken: res.data.newAccessToken
                }
                store.dispatch(saveUser(newUserInfo))
                config.headers["accessToken"] = "Bearer " + res.data.newAccessToken
            }
        } else {
            config.headers["accessToken"] = "Bearer " + user.accessToken
        }
    }
    return config
    }, (err) => { return Promise.reject(err) }
)

// axiosClient.interceptors.response.use((response) => {

// }, (error) => {

//     throw error
// })

const getNewAccessToken = async (accessToken) => {
    try {
        const res = await axios.post(BASE_URL+'/token/refresh', accessToken, {
            withCredentials: true, 
            headers: { 'accessToken': accessToken } 
        })
        return res
    } catch (error) {
        console.log(error)
    }
}

export default axiosClient;