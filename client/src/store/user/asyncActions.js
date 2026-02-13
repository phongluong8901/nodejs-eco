import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from "../../apis"; // Giả định đường dẫn tới folder api

export const getCurrent = createAsyncThunk(
    'user/current', 
    async (data, { rejectWithValue }) => {
        const response = await apis.apiGetCurrent(); 
        
        if (!response.success) {
            return rejectWithValue(response);
        }

        // --- DEBUG Ở ĐÂY ---
        console.log('Dữ liệu từ API Backend:', response); 
        // Xem trong Console: nó là response.rs, response.userData hay response.user?
        
        return response.rs; // <-- Kiểm tra xem có đúng là trường "rs" không nhé
    }
);