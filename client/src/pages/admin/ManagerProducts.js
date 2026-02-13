import React, { useEffect, useState, useCallback } from 'react';
import { Pagination, InputField, UpdateProduct, CustomizeVarriants } from '../../components';
import { apiGetProducts, apiDeleteProduct } from '../../apis';
import { formatMoney } from '../../ultils/helpers'; // Corrected typo from formartMoney
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
            confirmButtonColor: '#ee3131',
            cancelButtonColor: '#272727',
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
        <div className='w-full flex flex-col gap-4 bg-gray-50 min-h-screen relative font-sans'>
            {/* 1. OVERLAY UPDATE PRODUCT */}
            {editProduct && (
                <div className='absolute inset-0 z-[100] bg-white animate-slide-right'>
                    <UpdateProduct
                        editProduct={editProduct}
                        render={render}
                        setEditProduct={setEditProduct}
                    />
                </div>
            )}

            {/* 2. OVERLAY CUSTOMIZE VARRIANTS */}
            {customizeVarriant && (
                <div className='absolute inset-0 z-[100] bg-white animate-slide-right'>
                    <CustomizeVarriants
                        customizeVarriant={customizeVarriant}
                        render={render}
                        setCustomizeVarriant={setCustomizeVarriant}
                    />
                </div>
            )}

            <header className='h-[75px] flex justify-between items-center text-3xl font-extrabold px-4 border-b bg-white uppercase tracking-tight'>
                <span>Manage products</span>
            </header>

            <div className='p-4 flex flex-col gap-4'>
                {/* Search Bar Container */}
                <div className='flex justify-end items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100'>
                    <InputField
                        nameKey={'q'}
                        value={queries.q}
                        setValue={setQueries}
                        style='w-[400px]'
                        placeholder='Search products by title, brand, category...'
                    />
                </div>

                {/* Table Container */}
                <div className='overflow-x-auto shadow-md rounded-xl border border-gray-200 bg-white'>
                    <table className='table-auto w-full text-left border-collapse'>
                        <thead className='font-bold bg-gray-900 text-[12px] text-white uppercase tracking-wider'>
                            <tr>
                                <th className='px-6 py-4 text-center'>#</th>
                                <th className='px-6 py-4 text-center'>Thumb</th>
                                <th className='px-6 py-4'>Title</th>
                                <th className='px-6 py-4'>Brand</th>
                                <th className='px-6 py-4'>Category</th>
                                <th className='px-6 py-4 text-center'>Price</th>
                                <th className='px-6 py-4 text-center'>Stock</th>
                                <th className='px-6 py-4 text-center'>UpdatedAt</th>
                                <th className='px-6 py-4 text-center'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='text-sm text-gray-700'>
                            {products?.map((el, idx) => (
                                <tr key={el._id} className='border-b hover:bg-gray-50 transition-all'>
                                    <td className='py-4 px-6 text-center font-medium'>
                                        {(currentPage - 1) * pageSize + idx + 1}
                                    </td>
                                    <td className='py-4 px-6 text-center'>
                                        <img 
                                            src={el.thumb} 
                                            alt="thumb" 
                                            className='w-14 h-14 object-cover rounded-lg shadow-sm border border-gray-100 mx-auto' 
                                        />
                                    </td>
                                    <td className='py-4 px-6'>
                                        <span className='font-bold text-gray-800 line-clamp-1'>{el.title}</span>
                                    </td>
                                    <td className='py-4 px-6'>
                                        <span className='capitalize bg-gray-100 px-2 py-1 rounded text-xs text-gray-600 font-semibold'>{el.brand}</span>
                                    </td>
                                    <td className='py-4 px-6'>
                                        <span className='capitalize text-gray-600 font-medium'>{el.category}</span>
                                    </td>
                                    <td className='py-4 px-6 text-center font-bold text-main'>
                                        {formatMoney(el.price)} ₫
                                    </td>
                                    <td className='py-4 px-6 text-center'>
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${el.quantity > 10 ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                                            {el.quantity}
                                        </span>
                                    </td>
                                    <td className='py-4 px-6 text-center text-gray-400 italic text-xs'>
                                        {moment(el.updatedAt).format('MMM DD, YYYY')}
                                    </td>
                                    <td className='py-4 px-6 text-center'>
                                        <div className='flex justify-center gap-2'>
                                            <button
                                                onClick={() => setEditProduct(el)}
                                                className='p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm'
                                                title='Edit Product'
                                            >
                                                <BiEdit size={18} />
                                            </button>

                                            <button
                                                onClick={() => setCustomizeVarriant(el)}
                                                className='p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm'
                                                title='Variants'
                                            >
                                                <BiCustomize size={18} />
                                            </button>

                                            <button
                                                onClick={() => handleDeleteProduct(el._id)}
                                                className='p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm'
                                                title='Delete Product'
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

                <div className='w-full flex justify-end mt-4'>
                    <Pagination totalCount={counts} />
                </div>
            </div>
        </div>
    );
};

export default ManagerProducts;