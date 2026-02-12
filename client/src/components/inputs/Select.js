import React, { memo } from 'react'
import clsx from 'clsx'

const Select = ({ label, options = [], register, errors, id, validate, fullWidth, defaultValue, style }) => {
    return (
        <div className={clsx('flex flex-col gap-2', style)}>
            {label && <label htmlFor={id}>{label}</label>}
            <select
                id={id}
                defaultValue={defaultValue}
                {...register(id, validate)}
                className={clsx('form-select rounded-sm border border-gray-300 p-2 text-sm', fullWidth && 'w-full')}
            >
                <option value="">---CHOOSE---</option>
                {options.map(el => (
                    <option key={el.code} value={el.code}>
                        {el.value}
                    </option>
                ))}
            </select>
            {errors[id] && <small className='text-[10px] text-red-500 italic'>{errors[id]?.message}</small>}
        </div>
    )
}

export default memo(Select)