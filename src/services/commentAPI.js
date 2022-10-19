import axiosClient from "./axiosClient";

const commentAPI = {
    createComment : (commentPackage) => {
        const url = '/comment/create'
        return axiosClient.post(url, commentPackage)
    },
    updateComment : (commentPackage) => {
        const url = '/comment/update'
        return axiosClient.post(url, commentPackage)
    },
    getComment : (postInfo) => {
        const url = '/comment/get'
        return axiosClient.post(url, postInfo)
    },
}

export default commentAPI;