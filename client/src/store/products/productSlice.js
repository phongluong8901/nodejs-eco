import { createSlice } from "@reduxjs/toolkit";
import {getNewProducts} from "./asyncAction";

export const productSlice = createSlice({
    name: 'product',
    initialState: {
        newProducts: null, // Sửa từ newProduct thành newProducts cho đồng bộ số nhiều
        isLoading: false,   // Khai báo rõ ràng
        errorMessage: ''    // Khai báo rõ ràng
    },
    reducers: {
        // Reducer xử lý đồng bộ
        clearMessage: (state) => {
            state.errorMessage = '';
        }
    },
    extraReducers: (builder) => {
        // Khi đang gọi API
        builder.addCase(getNewProducts.pending, (state) => {
            state.isLoading = true;
        });

        // Khi gọi API thành công
        builder.addCase(getNewProducts.fulfilled, (state, action) => {
            state.isLoading = false;
            // SỬA TẠI ĐÂY: Gán vào newProducts thay vì categories
            state.newProducts = action.payload; 
        });

        // Khi gọi API thất bại
        builder.addCase(getNewProducts.rejected, (state, action) => {
            state.isLoading = false;
            // Xử lý lỗi an toàn
            state.errorMessage = action.payload?.message || action.error?.message || 'Something went wrong';
        });
    }
});

// Export các sync actions nếu cần
export const { clearMessage } = productSlice.actions;

export default productSlice.reducer;