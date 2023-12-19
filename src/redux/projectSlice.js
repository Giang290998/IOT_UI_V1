import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ProjectAPI from "../services/projectAPI";

const ProjectSlice = createSlice({
    name: "sensor",
    initialState:{
        status: 'idle',

        project_detail: null,
    },
    reducers:{
        updateProjectDetail: (state, action) => {

        },
        deleteProjectStore: (state) => {
            state.status = 'idle'
            state.project_detail = null;
        },
    },
    extraReducers: builder => {
        builder.addCase(GetProjectDetail.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(GetProjectDetail.fulfilled, (state, action) => {
            state.status = 'OK'
            const project_detail = action.payload;
            state.project_detail = project_detail;

        })
        builder.addCase(GetProjectDetail.rejected, (state) => {
            state.status = 'failed'
        })
    }
})

export const GetProjectDetail = createAsyncThunk('projectDetail/getAll', async () => {
    try {
        const res = await ProjectAPI.GetProjectDetail();
        return res.data
    } catch (error) {
        console.log(error)
    }
})

export const { updateProjectDetail, deleteProjectStore } = ProjectSlice.actions;
export default ProjectSlice.reducer;