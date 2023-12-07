import Cookies from "js-cookie";
import axiosClient from "./axiosClient";
import axios from "axios";

const userAPI = {
    createNewUser : (newUser) => {
        const url = '/users/register'
        return axiosClient.post(url, newUser)
    },
    
    loginUser : (user) => {
        const url = `/users/login?phone=${user.phone}&password=${user.password}`
        return axiosClient.get(url)
    },

    getOTP : () => {
        console.log(Cookies.get("access_token"));
        const url = `/users/otp/send`
        const BASE_URL = process.env.REACT_APP_BASE_URL_API
        const axiosCustom = axios.create({ 
            baseURL: BASE_URL,
            headers: {
                'content-type': 'application/json',
                'Authorization':`Bearer ${Cookies.get("access_token")}`
            },
            withCredentials: true,
        })
        return axiosCustom.get(url)
    },

    verifyOTP: (otp) => {
        const url = `/users/active?otp=${otp}`
        return axiosClient.get(url);
    },

    loginUserWithRememberToken : (persistent_token) => {
        const url = `/users/login/persistent`
        const BASE_URL = process.env.REACT_APP_BASE_URL_API
        const axiosCustom = axios.create({ 
            baseURL: BASE_URL,
            headers: {
                'content-type': 'application/json',
                'persistent_token':`Bearer ${persistent_token}`
            },
            withCredentials: true,
        })
        return axiosCustom.get(url)
    },

    loginWithThirdPartyInformation : (email) => {
        const url = `/user/login/third_party_information/${email}`
        return axiosClient.get(url)
    },

    getProfileInfo : (userId) => {
        const url = `/user/profile/information/${userId}`
        return axiosClient.get(url)
    },    

    modifiedInfoUser : (userId, info) => {
        const url = '/user/update'
        return axiosClient.patch(url, { id: userId, ...info })
    },

    searchUser : (stringSearch) => {
        const url = `/search/user/${stringSearch}`
        return axiosClient.get(url)
    }
}

export default userAPI;
