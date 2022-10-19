import axios from 'axios';

const uploadToCloudinary = {
    image: async (imageFile) => {
        return new Promise(async (resolve, reject) => {
            try {
                const formData = new FormData()
                formData.append('file', imageFile)
                formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET)
                const URL = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`
                const cloudRes = await axios.post(URL, formData)
                resolve(cloudRes.data.secure_url)
            } catch (error) {
                reject(error)
            }
        })
    },
    file: async (file) => {
        return new Promise(async (resolve, reject) => {
            try {
                const formData = new FormData()
                formData.append('file', file)
                formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET)
                const URL = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/auto/upload`
                const cloudRes = await axios.post(URL, formData)
                resolve(cloudRes.data.secure_url)
            } catch (error) {
                reject(error)
            }
        })
    }
}

export default uploadToCloudinary;