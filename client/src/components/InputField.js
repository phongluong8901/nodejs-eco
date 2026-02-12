import React from 'react'
import clsx from 'clsx'

const InputField = ({ 
    value, 
    setValue, 
    nameKey, 
    type, 
    invalidFields, 
    setInvalidFields,
    style, // Thêm style vào props để không bị lỗi "style is not defined"
    fullWidth,
    placeholder
}) => {
    return (
        <div className={clsx('flex flex-col relative mb-3', fullWidth ? 'w-full' : 'w-fit')}>
            {/* Hiển thị Label nhỏ nếu có giá trị để nhìn chuyên nghiệp hơn */}
            {value && <label className='absolute top-[-2px] left-[12px] block bg-white px-1 text-[10px] animate-slide-top-sm'>
                {nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}
            </label>}
            
            <input
                type={type || 'text'}
                className={clsx('px-4 py-2 rounded-sm border w-full mt-2 outline-none placeholder:text-sm placeholder:italic', style)}
                // Ưu tiên dùng placeholder truyền vào, nếu không có mới dùng nameKey
                placeholder={placeholder || (nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1))}
                value={value}
                onChange={e => setValue(prev => ({ ...prev, [nameKey]: e.target.value }))}
                onFocus={() => setInvalidFields && setInvalidFields(prev => prev.filter(el => el.name !== nameKey))}
            />

            {/* HIỂN THỊ LỖI CHỮ ĐỎ */}
            {invalidFields?.some(el => el.name === nameKey) && (
                <small className='text-red-500 italic text-[10px] absolute bottom-[-15px] left-1'>
                    {invalidFields.find(el => el.name === nameKey)?.mes}
                </small>
            )}
        </div>
    )
}

export default InputField