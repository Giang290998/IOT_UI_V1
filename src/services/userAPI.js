import axiosClient from "./axiosClient";

const userAPI = {
    createNewUser : (newUser) => {
        const url = '/user/create'
        return axiosClient.post(url, newUser)
    },
    
    loginUser : (user) => {
        const url = `/user/login/${user.id}/${user.password}`
        return axiosClient.get(url)
    },

    loginUserWithRememberToken : (rememberToken) => {
        const url = `/user/login/remember/${rememberToken}`
        return axiosClient.get(url)
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
}

export default userAPI;
