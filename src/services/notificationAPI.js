import axiosClient from "./axiosClient";

const notificationAPI = {
    createFriendRequest : (payload) => {
        const url = '/notification/friend/request/create'
        return axiosClient.post(url, payload)
    },
    getNotification : (userId) => {
        const url = `/notification/get/${userId}`
        return axiosClient.get(url)
    },
    responseFriendRequest : (payload) => {
        const url = '/notification/friend/request/delete'
        return axiosClient.put(url, payload)
    },
}

export default notificationAPI;