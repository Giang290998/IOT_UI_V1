import axiosClient from "./axiosClient";

const postAPI = {
    createNewPost : (newPost) => {
        const url = '/post/create'
        return axiosClient.post(url, newPost)
    },
    updatePost : (updatePostPackage) => {
        const url = '/post/update'
        return axiosClient.patch(url, updatePostPackage)
    },
    getAllPostProfile : (userId) => {
        const url = '/post/read/all/profile'
        return axiosClient.post(url, {id: userId})
    },
    getAllPostHomePage : (userId) => {
        const url = '/post/read/all/homepage'
        return axiosClient.post(url, {id: userId})
    },
}

export default postAPI;