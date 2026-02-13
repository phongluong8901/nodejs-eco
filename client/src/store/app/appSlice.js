import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncActions";

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        categories: null,
        isLoading: false,
        errorMessage: '', // Nên thêm field này vào initialState để quản lý lỗi
        isShowModal: false,
        modalChildren: null,
        isShowCart: false
    },
    reducers: {
        showModal: (state, action) => {
            state.isShowModal = action.payload.isShowModal
            state.modalChildren =action.payload.modalChildren
        },
        showCart: (state) => {
            state.isShowCart = !state.isShowCart;
        }
    },
    extraReducers: (builder) => {
        // Khi đang gọi API
        builder.addCase(actions.getCategories.pending, (state) => {
            state.isLoading = true;
        });

        // Khi gọi API thành công
        builder.addCase(actions.getCategories.fulfilled, (state, action) => {
            state.isLoading = false;
            state.categories = action.payload;
        });

        // Khi gọi API thất bại - SỬA TẠI ĐÂY
        builder.addCase(actions.getCategories.rejected, (state, action) => {
            state.isLoading = false;
            // Sử dụng Optional Chaining (?.) và giá trị mặc định để tránh lỗi undefined
            state.errorMessage = action.payload?.message || action.error?.message || 'Something went wrong';
        });
    }
});

export const { showModal, showCart } = appSlice.actions;

export default appSlice.reducer;