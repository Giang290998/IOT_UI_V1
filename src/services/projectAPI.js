import axiosClient from "./axiosClient";

const ProjectAPI = {
    GetProjectDetail : () => {
        const url = '/project/detail?project_id=1'
        return axiosClient.get(url)
    },
}

export default ProjectAPI;