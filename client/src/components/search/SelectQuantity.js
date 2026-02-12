import React, { memo } from 'react'

const SelectQuantity = ({ quantity, handleQuantity, handleChangeQuantity }) => {
    return (
        <div className='flex items-center'>
            <span 
                onClick={() => handleChangeQuantity('minus')}
                className='p-2 cursor-pointer border-r border-gray-300 bg-gray-100 hover:bg-gray-200'>-</span>
            <input 
                className='py-2 px-2 outline-none w-[50px] text-center'
                type="text"
                value={quantity}
                onChange={e => handleQuantity(e.target.value)}
            />
            <span 
                onClick={() => handleChangeQuantity('plus')}
                className='p-2 cursor-pointer border-l border-gray-300 bg-gray-100 hover:bg-gray-200'>+</span>
        </div>
    )
}

export default memo(SelectQuantity)