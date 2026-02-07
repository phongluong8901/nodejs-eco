import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from "../../apis"; // Giả định đường dẫn tới folder api

export const getNewProducts = createAsyncThunk(
    'product/newProducts', 
    async (data, { rejectWithValue }) => {
        const response = await apis.apiGetProducts({sort:'-createdAt'});
        
        if (!response.success) return rejectWithValue(response);

        // PHẢI TRẢ VỀ MẢNG SẢN PHẨM (.products)
        return response.products; 
    }
);