import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from "../../apis"; // Giả định đường dẫn tới folder api

export const getCurrent = createAsyncThunk(
    'user/current', 
    async (data, { rejectWithValue }) => {
        // PHẢI GỌI API GET_CURRENT, KHÔNG PHẢI CATEGORIES
        const response = await apis.apiGetCurrent(); 
        
        if (!response.success) {
            return rejectWithValue(response);
        }

        // Trả về dữ liệu user (thường là response.rs hoặc response.userData)
        return response.rs; 
    }
);