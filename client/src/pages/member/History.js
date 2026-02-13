import React, { useEffect, useState } from 'react'
import { apiGetUserOrder } from '../../apis'
import { formatMoney } from '../../ultils/helpers'
import moment from 'moment'
import { Pagination, InputField } from '../../components'
import { useSearchParams } from 'react-router-dom'
import clsx from 'clsx'

const History = () => {
    const [orders, setOrders] = useState(null)
    const [counts, setCounts] = useState(0)
    const [params] = useSearchParams()

    const fetchOrders = async (queries) => {
        const response = await apiGetUserOrder({ ...queries, limit: 10 })
        if (response.success) {
            setOrders(response.response)
            setCounts(response.counts)
        }
    }

    useEffect(() => {
        const queries = Object.fromEntries([...params])
        fetchOrders(queries)
    }, [params])

    return (
        <div className='w-full flex flex-col min-h-screen bg-gray-50 relative'>
            <header className='h-[75px] flex justify-between items-center text-3xl font-extrabold px-4 border-b bg-white uppercase tracking-tight'>
                <span>Order History</span>
            </header>

            <div className='p-4 flex flex-col gap-4'>
                {/* Bộ lọc đơn giản */}
                <div className='flex justify-end items-center px-4'>
                    <form className='w-[300px]'>
                        <InputField
                            nameKey={'q'}
                            placeholder='Search order ID...'
                            style='w-full'
                        />
                    </form>
                </div>

                <div className='overflow-x-auto shadow-md rounded-xl border border-gray-200 bg-white'>
                    <table className='table-auto w-full text-left border-collapse'>
                        <thead className='font-bold bg-gray-900 text-[12px] text-white uppercase tracking-wider'>
                            <tr>
                                <th className='px-6 py-4 text-center'>#</th>
                                <th className='px-6 py-4'>Order Detail</th>
                                <th className='px-6 py-4 text-center'>Total Amount</th>
                                <th className='px-6 py-4 text-center'>Status</th>
                                <th className='px-6 py-4 text-center'>Date Ordered</th>
                            </tr>
                        </thead>
                        <tbody className='text-sm text-gray-700'>
                            {orders?.map((el, index) => (
                                <tr key={el._id} className='border-b hover:bg-gray-50 transition-all'>
                                    <td className='py-4 px-6 text-center font-medium'>
                                        {((+params.get('page') || 1) - 1) * 10 + index + 1}
                                    </td>
                                    <td className='py-4 px-6'>
                                        <div className='flex flex-col gap-2'>
                                            <span className='font-bold text-blue-600'>ID: #{el._id.slice(-8).toUpperCase()}</span>
                                            <ul className='flex flex-col gap-1'>
                                                {el.products?.map((item, idx) => (
                                                    <li key={idx} className='flex items-center gap-2'>
                                                        <img 
                                                            src={item.thumbnail || item.product?.thumb} 
                                                            alt="thumb" 
                                                            className='w-8 h-8 object-cover rounded border'
                                                        />
                                                        <span className='font-medium text-gray-800 line-clamp-1'>
                                                            {item.title || item.product?.title}
                                                        </span>
                                                        <span className='text-xs text-gray-500 bg-gray-100 px-1 rounded'>
                                                            {`x${item.count}`}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </td>
                                    <td className='py-4 px-6 text-center font-bold text-main'>
                                        {formatMoney(el.total)} <span className='text-[10px]'>VND</span>
                                    </td>
                                    <td className='py-4 px-6 text-center'>
                                        <span className={clsx(
                                            'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm',
                                            el.status === 'Succeed' || el.status === 'Successed' ? 'bg-emerald-100 text-emerald-600' : 
                                            el.status === 'Cancelled' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                                        )}>
                                            {el.status}
                                        </span>
                                    </td>
                                    <td className='py-4 px-6 text-center text-gray-500'>
                                        <div className='flex flex-col italic'>
                                            <span>{moment(el.createdAt).format('DD/MM/YYYY')}</span>
                                            <span className='text-[10px]'>{moment(el.createdAt).format('HH:mm:ss')}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {(!orders || orders.length === 0) && (
                        <div className='w-full text-center py-12 flex flex-col items-center gap-2 bg-white'>
                            <span className='text-4xl'>📦</span>
                            <span className='italic text-gray-400'>You haven't placed any orders yet.</span>
                        </div>
                    )}
                </div>

                {orders?.length > 0 && (
                    <div className='w-full flex justify-end mt-4'>
                        <Pagination totalCount={counts} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default History