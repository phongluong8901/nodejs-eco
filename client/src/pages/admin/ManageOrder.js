import React, { useEffect, useState, useCallback } from 'react';
import { apiGetOrders, apiUpdateStatusOrder, apiDeleteOrder } from '../../apis';
import { Pagination, InputField } from '../../components';
import { formatMoney } from '../../ultils/helpers';
import moment from 'moment';
import { useSearchParams } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import icons from '../../ultils/icons';

const { BiEdit, BiTrash } = icons;

const ManageOrder = () => {
    const [orders, setOrders] = useState(null);
    const [counts, setCounts] = useState(0);
    const [params] = useSearchParams();
    const [update, setUpdate] = useState(false);

    const [queries, setQueries] = useState({ q: "" });
    const queriesDebounce = useDebounce(queries.q, 800);

    const fetchOrders = async (searchParams) => {
        const response = await apiGetOrders(searchParams);
        if (response.success) {
            setCounts(response.counts);
            setOrders(response.orders);
        }
    };

    const render = useCallback(() => {
        setUpdate(!update);
    }, [update]);

    useEffect(() => {
        const searchParams = Object.fromEntries([...params]);
        if (queriesDebounce) searchParams.q = queriesDebounce;
        fetchOrders(searchParams);
    }, [queriesDebounce, params, update]);

    const handleUpdateStatus = (oid, currentStatus) => {
        Swal.fire({
            title: 'Update Order Status',
            input: 'select',
            inputOptions: {
                'Processing': 'Processing',
                'Succeed': 'Succeed',
                'Cancelled': 'Cancelled'
            },
            inputValue: currentStatus,
            showCancelButton: true,
            confirmButtonText: 'Update',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#ee3131',
        }).then(async (result) => {
            if (result.isConfirmed && result.value) {
                const response = await apiUpdateStatusOrder(oid, { status: result.value });
                if (response.success) {
                    render();
                    toast.success(response.mes);
                } else {
                    toast.error(response.mes);
                }
            }
        });
    };

    const handleDeleteOrder = (oid) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ee3131',
            cancelButtonColor: '#272727',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiDeleteOrder(oid);
                if (response.success) {
                    render();
                    toast.success(response.mes);
                } else toast.error(response.mes);
            }
        });
    };

    const pageSize = +params.get('limit') || 10;
    const currentPage = +params.get('page') || 1;

    return (
        <div className='w-full flex flex-col gap-4 bg-gray-50 min-h-screen'>
            <header className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b bg-white uppercase tracking-tight'>
                <span>Order Management</span>
            </header>

            <div className='p-4 flex flex-col gap-4'>
                <div className='flex justify-end items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100'>
                    <InputField
                        nameKey={'q'}
                        value={queries.q}
                        setValue={setQueries}
                        style='w-[400px]'
                        placeholder='Search by Order ID or Customer Name...'
                    />
                </div>

                <div className='overflow-x-auto shadow-md rounded-xl border border-gray-200 bg-white'>
                    <table className='table-auto w-full text-left'>
                        <thead className='font-bold bg-gray-900 text-[12px] text-white uppercase tracking-wider'>
                            <tr>
                                <th className='px-6 py-4 text-center'>#</th>
                                <th className='px-6 py-4'>Order ID</th>
                                <th className='px-6 py-4'>Customer</th>
                                <th className='px-6 py-4 text-center'>Products</th>
                                <th className='px-6 py-4 text-center'>Total</th>
                                <th className='px-6 py-4 text-center'>Status</th>
                                <th className='px-6 py-4 text-center'>Created At</th>
                                <th className='px-6 py-4 text-center'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='text-sm text-gray-700'>
                            {orders?.map((el, idx) => (
                                <tr key={el._id} className='border-b hover:bg-gray-50 transition-all'>
                                    <td className='py-4 px-6 text-center font-medium'>
                                        {(currentPage - 1) * pageSize + idx + 1}
                                    </td>
                                    <td className='py-4 px-6 font-mono text-blue-600 font-semibold'>
                                        #{el._id?.slice(-8).toUpperCase()}
                                    </td>
                                    <td className='py-4 px-6'>
                                        <div className='flex flex-col'>
                                            <span className='font-bold text-gray-800'>{`${el.orderBy?.lastname} ${el.orderBy?.firstname}`}</span>
                                            <span className='text-xs text-gray-400'>{el.orderBy?.email}</span>
                                        </div>
                                    </td>
                                    <td className='py-4 px-6 text-center'>
                                        <span className='bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold'>
                                            {el.products?.length} items
                                        </span>
                                    </td>
                                    <td className='py-4 px-6 text-center font-bold text-main'>
                                        {formatMoney(el.total)} ₫
                                    </td>
                                    <td className='py-4 px-6 text-center'>
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                            el.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                                            el.status === 'Succeed' ? 'bg-emerald-100 text-emerald-600' :
                                            'bg-amber-100 text-amber-600'
                                        }`}>
                                            {el.status}
                                        </span>
                                    </td>
                                    <td className='py-4 px-6 text-center text-gray-500 italic'>
                                        {moment(el.createdAt).format('MMM DD, YYYY')}
                                    </td>
                                    <td className='py-4 px-6 text-center'>
                                        <div className='flex justify-center gap-3'>
                                            <button 
                                                onClick={() => handleUpdateStatus(el._id, el.status)}
                                                className='p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors shadow-sm'
                                            >
                                                <BiEdit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteOrder(el._id)}
                                                className='p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors shadow-sm'
                                            >
                                                <BiTrash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className='flex justify-end mt-4'>
                    <Pagination totalCount={counts} />
                </div>
            </div>
        </div>
    );
};

export default ManageOrder;