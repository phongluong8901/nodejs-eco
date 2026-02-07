import { createSlice, current } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        current: null,
        token: null
    },
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
            state.current = action.payload.userData
            state.token = action.payload.token
        }
    },
    // extraReducers: (builder) => {
    //     // Khi đang gọi API
    //     builder.addCase(actions.getCategories.pending, (state) => {
    //         state.isLoading = true;
    //     });

    //     // Khi gọi API thành công
    //     builder.addCase(actions.getCategories.fulfilled, (state, action) => {
    //         state.isLoading = false;
    //         state.categories = action.payload;
    //     });

    //     // Khi gọi API thất bại - SỬA TẠI ĐÂY
    //     builder.addCase(actions.getCategories.rejected, (state, action) => {
    //         state.isLoading = false;
    //         // Sử dụng Optional Chaining (?.) và giá trị mặc định để tránh lỗi undefined
    //         state.errorMessage = action.payload?.message || action.error?.message || 'Something went wrong';
    //     });
    // }
});

export const { login } = userSlice.actions;

export default userSlice.reducer;