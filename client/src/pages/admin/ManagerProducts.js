import React, { useEffect, useState, useCallback } from 'react';
import { Pagination, InputField, UpdateProduct, CustomizeVarriants } from '../../components';
import { apiGetProducts, apiDeleteProduct } from '../../apis';
import { formartMoney } from '../../ultils/helpers';
import moment from 'moment';
import { useSearchParams } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import icons from '../../ultils/icons';

const { BiEdit, BiCustomize, BiTrash } = icons;

const ManagerProducts = () => {
    const [products, setProducts] = useState(null);
    const [counts, setCounts] = useState(0);
    const [params] = useSearchParams();
    const [update, setUpdate] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [customizeVarriant, setCustomizeVarriant] = useState(null);

    const [queries, setQueries] = useState({ q: "" });
    const queriesDebounce = useDebounce(queries.q, 800);

    const fetchProducts = async (searchParams) => {
        const response = await apiGetProducts(searchParams);
        if (response.success) {
            setCounts(response.counts);
            setProducts(response.products);
        }
    };

    const render = useCallback(() => {
        setUpdate(!update);
    }, [update]);

    useEffect(() => {
        const searchParams = Object.fromEntries([...params]);
        if (queriesDebounce) searchParams.q = queriesDebounce;
        fetchProducts(searchParams);
    }, [queriesDebounce, params, update]);

    const handleDeleteProduct = (pid) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiDeleteProduct(pid);
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
        <div className='w-full flex flex-col gap-4 bg-white min-h-screen relative'>
            {/* 1. OVERLAY CẬP NHẬT SẢN PHẨM */}
            {editProduct && (
                <div className='absolute inset-0 z-[100] bg-white animate-slide-right'>
                    <UpdateProduct
                        editProduct={editProduct}
                        render={render}
                        setEditProduct={setEditProduct}
                    />
                </div>
            )}

            {/* 2. OVERLAY THÊM BIẾN THỂ (CUSTOMIZE VARRIANTS) */}
            {customizeVarriant && (
                <div className='absolute inset-0 z-[100] bg-white animate-slide-right'>
                    <CustomizeVarriants
                        customizeVarriant={customizeVarriant}
                        render={render}
                        setCustomizeVarriant={setCustomizeVarriant}
                    />
                </div>
            )}

            <header className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b uppercase'>
                <span>Manage products</span>
            </header>

            <div className='p-4'>
                <div className='flex justify-end py-4'>
                    <InputField
                        nameKey={'q'}
                        value={queries.q}
                        setValue={setQueries}
                        style='w-[400px]'
                        placeholder='Search products by title, brand, category...'
                    />
                </div>

                <div className='overflow-x-auto shadow-md'>
                    <table className='table-auto w-full text-left border-collapse'>
                        <thead className='font-bold bg-sky-700 text-[13px] text-white uppercase'>
                            <tr className='border border-gray-500'>
                                <th className='px-4 py-3 text-center'>#</th>
                                <th className='px-4 py-3 text-center'>Thumb</th>
                                <th className='px-4 py-3'>Title</th>
                                <th className='px-4 py-3'>Brand</th>
                                <th className='px-4 py-3'>Category</th>
                                <th className='px-4 py-3'>Price</th>
                                <th className='px-4 py-3'>Quantity</th>
                                <th className='px-4 py-3 text-center'>UpdatedAt</th>
                                <th className='px-4 py-3 text-center'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products?.map((el, idx) => (
                                <tr key={el._id} className='border border-gray-300 hover:bg-gray-50'>
                                    <td className='py-3 px-4 text-center'>
                                        {(currentPage - 1) * pageSize + idx + 1}
                                    </td>
                                    <td className='py-3 px-4 text-center'>
                                        <img src={el.thumb} alt="" className='w-12 h-12 object-cover rounded mx-auto' />
                                    </td>
                                    <td className='py-3 px-4'>
                                        <span className='line-clamp-1'>{el.title}</span>
                                    </td>
                                    <td className='py-3 px-4'>
                                        <span className='capitalize text-sm'>{el.brand}</span>
                                    </td>
                                    <td className='py-3 px-4'>
                                        <span className='capitalize text-sm'>{el.category}</span>
                                    </td>
                                    <td className='py-3 px-4'>
                                        <span className='text-sm'>{formartMoney(el.price)} ₫</span>
                                    </td>
                                    <td className='py-3 px-4 text-center'>
                                        <span className='text-sm'>{el.quantity}</span>
                                    </td>
                                    <td className='py-3 px-4 text-center text-xs text-gray-600'>
                                        {moment(el.updatedAt).format('DD/MM/YYYY')}
                                    </td>
                                    <td className='py-3 px-4 text-center font-medium'>
                                        <div className='flex justify-center gap-3'>
                                            <span
                                                onClick={() => setEditProduct(el)}
                                                className='text-blue-500 hover:text-blue-700 cursor-pointer p-2 hover:bg-gray-100 rounded-full'
                                                title='Edit'
                                            >
                                                <BiEdit size={20} />
                                            </span>

                                            {/* Nút Customize Varriant */}
                                            <span
                                                onClick={() => setCustomizeVarriant(el)}
                                                className='text-green-500 hover:text-green-700 cursor-pointer p-2 hover:bg-gray-100 rounded-full'
                                                title='Add Variant'
                                            >
                                                <BiCustomize size={20} />
                                            </span>

                                            <span
                                                onClick={() => handleDeleteProduct(el._id)}
                                                className='text-red-500 hover:text-red-700 cursor-pointer p-2 hover:bg-gray-100 rounded-full'
                                                title='Delete'
                                            >
                                                <BiTrash size={20} />
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className='w-full flex justify-end mt-4'>
                    <Pagination totalCount={counts} />
                </div>
            </div>
        </div>
    );
};

export default ManagerProducts;