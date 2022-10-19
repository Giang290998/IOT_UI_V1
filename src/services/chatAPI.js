import axiosClient from "./axiosClient";

const chatAPI = {
    createNewConversation : (payload) => {
        const url = '/chat/normal/create'
        return axiosClient.post(url, payload)
    },
    createMessage : (payload) => {
        const url = '/message/create'
        return axiosClient.post(url, payload)
    },
    getMessages : (payload) => {
        const url = '/chat/get/all/message'
        return axiosClient.post(url, payload)
    },
    updateMessage : (payload) => {
        const url = '/message/modified'
        return axiosClient.put(url, payload)
    },
    updateManyMessage : (payload) => {
        const url = '/messages/modified/status'
        return axiosClient.put(url, payload)
    },
    updateAllMessageStatusToRealtime : (payload) => {
        const url = '/messages/modified/all/status'
        return axiosClient.put(url, payload)
    },
}

export default chatAPI;
