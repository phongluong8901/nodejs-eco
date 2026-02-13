import React, { memo } from 'react'

const SelectQuantity = ({ quantity, handleQuantity, handleChangeQuantity, dark }) => {
    return (
        <div className='flex items-center'>
            {/* Nút trừ */}
            <span 
                onClick={() => handleChangeQuantity('minus')}
                className={`p-2 cursor-pointer border-r border-gray-300 ${dark ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'}`}
            >
                -
            </span>

            {/* Ô nhập số lượng */}
            <input 
                className={`py-2 px-2 outline-none w-[50px] text-center ${dark ? 'bg-black text-white border-y border-gray-300' : 'bg-white text-black'}`}
                type="text"
                value={quantity}
                onChange={e => handleQuantity(e.target.value)}
            />

            {/* Nút cộng */}
            <span 
                onClick={() => handleChangeQuantity('plus')}
                className={`p-2 cursor-pointer border-l border-gray-300 ${dark ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'}`}
            >
                +
            </span>
        </div>
    )
}

export default memo(SelectQuantity)