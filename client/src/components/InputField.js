import React from 'react'
import clsx from 'clsx'

const InputField = ({ 
    value, 
    setValue, 
    nameKey, 
    type, 
    invalidFields, 
    setInvalidFields,
    style, 
    fullWidth,
    placeholder,
    isHideLabel
}) => {
    // Kiểm tra xem field này hiện tại có đang bị lỗi không
    const isInvalid = invalidFields?.some(el => el.name === nameKey)

    return (
        <div className={clsx('flex flex-col relative mb-6', fullWidth ? 'w-full' : 'w-fit')}>
            {/* Label hiệu ứng Floating: Chỉ hiện khi có value và không bị ẩn bởi prop isHideLabel */}
            {!isHideLabel && value && (
                <label 
                    className='absolute top-0 left-[12px] block bg-white px-1 text-[12px] text-gray-500 z-10 animate-slide-top-sm'
                >
                    {nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}
                </label>
            )}
            
            <input
                type={type || 'text'}
                className={clsx(
                    'px-4 py-3 rounded-md border w-full outline-none transition-all duration-200 placeholder:text-gray-400',
                    // Đổi màu border khi focus hoặc khi bị lỗi
                    isInvalid ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-main focus:ring-1 focus:ring-main',
                    style
                )}
                placeholder={placeholder || (nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1))}
                value={value}
                onChange={e => setValue(prev => ({ ...prev, [nameKey]: e.target.value }))}
                // Khi người dùng bắt đầu gõ lại (onFocus), xóa thông báo lỗi của trường đó
                onFocus={() => setInvalidFields && setInvalidFields([])}
            />

            {/* Hiển thị lỗi với icon hoặc màu sắc nhấn mạnh */}
            {isInvalid && (
                <small className='text-red-500 italic text-[11px] absolute left-1 bottom-[-18px]'>
                    {invalidFields.find(el => el.name === nameKey)?.mes}
                </small>
            )}
        </div>
    )
}

export default InputField