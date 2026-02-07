import React from 'react'

const InputField = ({ value, setValue, nameKey, type, invalidFields, setInvalidFields }) => {
    return (
        <div className='w-full flex flex-col relative mb-2'>
            <input
                type={type || 'text'}
                className='px-4 py-2 rounded-sm border w-full mt-2 outline-none'
                placeholder={nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}
                value={value}
                onChange={e => setValue(prev => ({ ...prev, [nameKey]: e.target.value }))}
                // Khi bắt đầu gõ thì xóa các lỗi cũ đi
                onFocus={() => setInvalidFields && setInvalidFields([])}
            />
            {/* ĐOẠN HIỂN THỊ LỖI CHỮ ĐỎ */}
            {invalidFields?.some(el => el.name === nameKey) && (
                <small className='text-red-500 italic text-[10px] absolute bottom-[-15px] left-1'>
                    {invalidFields.find(el => el.name === nameKey)?.mes}
                </small>
            )}
        </div>
    )
}

export default InputField