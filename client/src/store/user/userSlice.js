import { createSlice } from "@reduxjs/toolkit"; // Bỏ import 'current' bị thừa
import * as actions from "./asyncActions";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        current: null,
        token: null,
        isLoading: false,
        mes: '',
    },
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
            state.token = action.payload.token
        },
        logout: (state) => {
            state.isLoggedIn = false
            state.token = null
            state.current = null
            state.isLoading = false
            state.mes = ''
        },
        // Thêm action này để xóa thông báo sau khi hiện Alert xong
        clearMessage: (state) => {
            state.mes = ''
        }
    },
    extraReducers: (builder) => {
        // Khi đang gọi API
        builder.addCase(actions.getCurrent.pending, (state) => {
            state.isLoading = true;
        });

        // Khi gọi API thành công
        builder.addCase(actions.getCurrent.fulfilled, (state, action) => {
            state.isLoading = false;
            state.current = action.payload;
        });

        // XỬ LÝ KHI PHIÊN ĐĂNG NHẬP HẾT HẠN (API REJECTED)
        builder.addCase(actions.getCurrent.rejected, (state, action) => {
            state.isLoading = false;
            state.current = null;
            state.isLoggedIn = false;
            state.token = null;
            // Gán thông báo lỗi để TopHeader bắt được
            state.mes = 'Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại.'
        });
    }
});

// Nhớ export thêm clearMessage nhé!
export const { login, logout, clearMessage } = userSlice.actions;

export default userSlice.reducer;