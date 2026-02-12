import React from 'react'
import usePagination from '../../hooks/usePagination'
import PagiItem from './PagiItem'
import { useSearchParams, useNavigate, createSearchParams } from 'react-router-dom'

const Pagination = ({ totalCount }) => {
    const [params] = useSearchParams()
    const navigate = useNavigate()
    
    const currentPage = +params.get('page') || 1
    const pageSize = +params.get('limit') || 10 // Lấy limit từ URL

    const pagination = usePagination({
        totalProductCount: totalCount,
        currentPage: currentPage,
        siblingCount: 1,
        pageSize: pageSize
    })

    const handleSelectLimit = (e) => {
        const queries = Object.fromEntries([...params])
        queries.limit = e.target.value
        queries.page = 1 // Reset về trang 1 khi đổi số lượng hiển thị
        navigate({
            pathname: window.location.pathname,
            search: createSearchParams(queries).toString()
        })
    }

    if (!totalCount || totalCount === 0) return null

    return (
        <div className='flex flex-col gap-4 items-center justify-between w-full md:flex-row p-4'>
            <div className='flex items-center gap-4 italic text-sm text-gray-600'>
                <span>{`Show ${Math.min((currentPage - 1) * pageSize + 1, totalCount)} - ${Math.min(currentPage * pageSize, totalCount)} of ${totalCount} users`}</span>
                <div className='flex items-center gap-2 non-italic text-black font-medium'>
                    <span className='text-xs'>Rows per page:</span>
                    <select 
                        value={pageSize}
                        onChange={handleSelectLimit}
                        className='border rounded-md px-1 py-0.5 bg-gray-50 outline-none cursor-pointer'
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>

            <div className='flex items-center gap-2'>
                {pagination?.map((el, index) => (
                    <PagiItem key={index}>{el}</PagiItem>
                ))}
            </div>
        </div>
    )
}

export default Pagination