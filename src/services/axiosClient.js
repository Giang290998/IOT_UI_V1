import axios from "axios";
import jwtDecode from "jwt-decode";
import store from '../redux/store';
import Cookies from "js-cookie";
import HttpStatusCustom from "../utils/httpStatus";

const BASE_URL = process.env.REACT_APP_BASE_URL_API
const axiosClient = axios.create({ 
    baseURL: BASE_URL,
    headers: {
        'content-type': 'application/json'
    },
    withCredentials: true,
})

axiosClient.interceptors.request.use(async (config) => {
    const user = store.getState().auth.login.user
    if (user) {
        const access_token = Cookies.get("access_token")
        const payloadAccessToken = jwtDecode(access_token)
        const time = (new Date()).getTime()/1000
        if (payloadAccessToken.exp < time) {
            try {
                const res = await getNewToken()
                if (HttpStatusCustom.isSuccess(res.data)) {
                    Cookies.set("access_token", res.data.access_token)
                    Cookies.set("refresh_token", res.data.refresh_token)
                    config.headers["Authorization"] = "Bearer " + Cookies.get("access_token")
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            config.headers["Authorization"] = "Bearer " + access_token
        }
    }
    return config
    }, (err) => { return Promise.reject(err) }
)

// axiosClient.interceptors.response.use((response) => {

// }, (error) => {

//     throw error
// })

const getNewToken = async () => {
    const access_token = Cookies.get("access_token")
    const refresh_token = Cookies.get("refresh_token")
    try {
        const res = await axios.post(BASE_URL+'/token/refresh', {
            withCredentials: true, 
            headers: { 
                'access_token': access_token,
                'refresh_token': refresh_token
            } 
        })
        return res
    } catch (error) {
        console.log(error)
    }
}

export default axiosClient;