const HttpStatusCustom = {
    isSuccess: (status_code) => {
        return status_code >= 200 && status_code < 400;
    },
    isBadRequest: (status_code) => {
        return status_code >= 400 && status_code < 500;
    },
    isServerError: (status_code) => {
        return status_code >= 500;
    }
}

export default HttpStatusCustom;