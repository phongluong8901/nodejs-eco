import React, { memo, useState, useEffect } from 'react'
import icons from '../../ultils/icons'
import { colors } from '../../ultils/constant'
import { useNavigate, createSearchParams, useSearchParams, useLocation } from 'react-router-dom'
import useDebounce from '../../hooks/useDebounce'

const { AiOutlineDown } = icons

const SearchItem = ({ name, activeClick, changeActiveFilter, type = 'checkbox' }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [params] = useSearchParams()
    const [selected, setSelected] = useState([])
    const [price, setPrice] = useState({ from: '', to: '' })

    // Đưa Debounce lên trên đầu để tránh lỗi "before initialization"
    const debouncedFrom = useDebounce(price.from, 500)
    const debouncedTo = useDebounce(price.to, 500)

    // Sync dữ liệu từ URL về State khi người dùng F5
    useEffect(() => {
        if (type === 'checkbox') {
            const colorInUrl = params.get('color')
            if (colorInUrl) setSelected(colorInUrl.split(','))
        }
        if (type === 'input') {
            setPrice({
                from: params.get('from') || '',
                to: params.get('to') || ''
            })
        }
    }, [params])

    // Effect xử lý Price (Input)
    useEffect(() => {
        if (type === 'input') {
            const queries = Object.fromEntries([...params])
            if (Number(debouncedFrom) > 0) queries.from = debouncedFrom
            else delete queries.from

            if (Number(debouncedTo) > 0) queries.to = debouncedTo
            else delete queries.to
            
            queries.page = 1 
            navigate({
                pathname: location.pathname,
                search: createSearchParams(queries).toString()
            })
        }
    }, [debouncedFrom, debouncedTo])

    // Effect xử lý Color (Checkbox)
    useEffect(() => {
        if (type === 'checkbox') {
            const queries = Object.fromEntries([...params])
            if (selected.length > 0) queries.color = selected.join(',')
            else delete queries.color
            
            queries.page = 1
            navigate({
                pathname: location.pathname,
                search: createSearchParams(queries).toString()
            })
        }
    }, [selected])

    const handleSelect = (e) => {
        const value = e.target.value
        const alreadySelected = selected.find(el => el === value)
        if (alreadySelected) setSelected(prev => prev.filter(el => el !== value))
        else setSelected(prev => [...prev, value])
    }

    const handleReset = (e) => {
        e.stopPropagation()
        if (type === 'checkbox') setSelected([])
        else setPrice({ from: '', to: '' })
    }

    return (
        <div className='p-3 cursor-pointer text-gray-500 text-xs gap-6 relative border border-gray-800 flex justify-between items-center'
            onClick={() => changeActiveFilter(name)}>
            <span className='capitalize font-medium'>{name}</span>
            <AiOutlineDown />
            {activeClick === name && (
                <div className='z-20 absolute top-[calc(100%+1px)] left-[-1px] w-max min-w-[150px] p-4 border bg-white shadow-lg'
                    onClick={e => e.stopPropagation()}>
                    <div className='flex items-center justify-between gap-8 mb-4 border-b pb-2'>
                        <span className='whitespace-nowrap text-gray-800'>
                            {type === 'checkbox' ? `${selected.length} selected` : 'Price range'}
                        </span>
                        <span className='underline cursor-pointer hover:text-red-600' onClick={handleReset}>Reset</span>
                    </div>
                    {type === 'checkbox' && (
                        <div className='flex flex-col gap-3'>
                            {colors?.map((el, index) => (
                                <div key={index} className='flex items-center gap-4'>
                                    <input type="checkbox" value={el} id={el} checked={selected.includes(el)}
                                        onChange={handleSelect} className='w-4 h-4 cursor-pointer accent-blue-600' />
                                    <label htmlFor={el} className='capitalize text-gray-700 cursor-pointer'>{el}</label>
                                </div>
                            ))}
                        </div>
                    )}
                    {type === 'input' && (
                        <div className='flex items-center gap-2'>
                            <input className='p-2 border outline-none w-[90px]' type="number" placeholder="From"
                                value={price.from} onChange={e => setPrice(prev => ({ ...prev, from: e.target.value }))} />
                            <input className='p-2 border outline-none w-[90px]' type="number" placeholder="To"
                                value={price.to} onChange={e => setPrice(prev => ({ ...prev, to: e.target.value }))} />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
export default memo(SearchItem)