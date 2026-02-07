import React from 'react'

const Countdown = ({ unit, number }) => {
  return (
    <div className='flex flex-col justify-center items-center w-[30%] h-[70px] bg-white border px-4 border-gray-200 shadow-sm rounded-lg'>
      <span className='text-xl font-bold text-gray-900 leading-none'>
        {number?.toString().padStart(2, '0')}
      </span>
      <span className='text-[10px] uppercase tracking-wide text-gray-500 mt-1'>
        {unit}
      </span>
    </div>
  )
}

export default Countdown