import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from "../../apis"; // Giả định đường dẫn tới folder api

export const getCategories = createAsyncThunk(
    'app/categories', 
    async (data, { rejectWithValue }) => {
        const response = await apis.apiGetCategories();
        
        // Kiểm tra nếu API trả về thành công
        if (!response.success) {
            return rejectWithValue(response);
        }

        return response.prodCategories;
    }
);