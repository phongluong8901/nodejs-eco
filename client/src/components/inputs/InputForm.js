import React, { memo } from 'react'
import clsx from 'clsx'

const InputForm = ({ 
    label, 
    disabled, 
    register, 
    errors, 
    id, 
    validate, 
    type = 'text', 
    placeholder, 
    fullWidth, 
    defaultValue,
    style // Thêm prop style để tùy biến thêm nếu cần
}) => {
    return (
        // Nếu dùng trong table, bạn có thể cân nhắc bỏ h-[78px] hoặc giảm xuống
        <div className={clsx('flex flex-col gap-2', style)}>
            {/* Sửa từ <labe> thành <label> */}
            {label && <label className='font-semibold' htmlFor={id}>{label}</label>}
            
            <input
                type={type}
                id={id}
                {...register(id, validate)}
                disabled={disabled}
                placeholder={placeholder}
                // Sử dụng class form-input (thường có sẵn khi dùng @tailwindcss/forms)
                className={clsx('form-input rounded-sm', fullWidth && 'w-full', errors[id] && 'border-red-500')}
                defaultValue={defaultValue}
            />
            
            {/* Hiển thị lỗi */}
            {errors[id] && <small className='text-[10px] text-red-500 italic'>{errors[id]?.message}</small>}
        </div>
    )
}

export default memo(InputForm)