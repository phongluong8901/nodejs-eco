import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useSearchParams, useNavigate, createSearchParams, useLocation } from 'react-router-dom'
import { Breadcrumb, Product, SearchItem } from '../../components' 
import Pagination from '../../components/pagination/Pagination'
import { apiGetProducts } from '../../apis'
import Masonry from 'react-masonry-css'

const breakpointColumnsObj = { default: 4, 1100: 3, 700: 2, 500: 1 };

const Products = () => {
    const [products, setProducts] = useState(null)
    const [counts, setCounts] = useState(0)
    const [activeClick, setActiveClick] = useState(null)
    const { category } = useParams()
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const location = useLocation()

    const fetchProductByCategory = async (queries) => {
        const response = await apiGetProducts(queries)
        if (response.success) {
            setProducts(response.products)
            setCounts(response.counts)
        }
    }

    useEffect(() => {
        // 1. Chuyển đổi params từ URL thành object
        const queries = Object.fromEntries([...params])
        
        // 2. Xử lý Category: 
        // Nếu category là chữ ':category' (lỗi route) hoặc 'products' (xem tất cả) thì xóa filter category
        if (category && category !== 'products' && !category.startsWith(':')) {
            queries.category = category
        } else {
            delete queries.category
        }

        // 3. Logic lọc giá (Price): Chuyển from/to thành price[gte]/price[lte] để Backend hiểu
        if (queries.from) {
            queries['price[gte]'] = queries.from
            delete queries.from
        }
        if (queries.to) {
            queries['price[lte]'] = queries.to
            delete queries.to
        }

        // 4. Dọn dẹp các tham số rỗng hoặc undefined
        Object.keys(queries).forEach(key => {
            if (!queries[key] || queries[key] === 'undefined') delete queries[key]
        })

        fetchProductByCategory(queries)
        window.scrollTo(0, 0)
    }, [params, category])

    const changeActiveFilter = useCallback((name) => {
        if (activeClick === name) setActiveClick(null)
        else setActiveClick(name)
    }, [activeClick])

    return (
        <div className='w-full'>
            <div className='h-[81px] bg-gray-100 flex items-center justify-center mb-8'>
                <div className='w-main'>
                    <h3 className='font-bold uppercase'>
                        {(!category || category === 'products' || category.startsWith(':')) 
                            ? 'All Products' 
                            : category}
                    </h3>
                    <Breadcrumb category={category?.startsWith(':') ? 'Products' : category} />
                </div>
            </div>

            <div className='w-main border p-4 flex justify-between mt-8 m-auto items-center shadow-sm bg-white'>
                <div className='w-4/5 flex-auto flex gap-4 items-center'>
                    <span className='font-semibold text-gray-700 text-sm'>Filter by:</span>
                    <SearchItem 
                        name='Price' 
                        activeClick={activeClick} 
                        changeActiveFilter={changeActiveFilter} 
                        type='input' 
                    />
                    <SearchItem 
                        name='Color' 
                        activeClick={activeClick} 
                        changeActiveFilter={changeActiveFilter} 
                    />
                </div>
                <div className='w-1/5 flex flex-col gap-2'>
                    <span className='font-semibold text-gray-700 text-sm'>Sort by:</span>
                    <select 
                        className='border p-2 text-sm outline-none cursor-pointer rounded'
                        value={params.get('sort') || ''}
                        onChange={e => {
                            const queries = Object.fromEntries([...params])
                            if (e.target.value) queries.sort = e.target.value
                            else delete queries.sort
                            navigate({
                                pathname: location.pathname,
                                search: createSearchParams(queries).toString()
                            })
                        }}
                    >
                        <option value="">Default</option>
                        <option value="-price">Price: High to Low</option>
                        <option value="price">Price: Low to High</option>
                        <option value="-createdAt">Newest</option>
                    </select>
                </div>
            </div>

            <div className='mt-8 w-main m-auto min-h-[500px]'>
                {products?.length > 0 ? (
                    <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className="my-masonry-grid flex ml-[-16px]"
                        columnClassName="my-masonry-grid_column pl-[16px]"
                    >
                        {products?.map(el => (
                            <div key={el._id} className='mb-[20px]'>
                                <Product
                                    pid={el._id}
                                    productData={el}
                                    normal={true}
                                />
                            </div>
                        ))}
                    </Masonry>
                ) : (
                    <div className='w-full text-center italic text-gray-500 py-10'>
                        No products found.
                    </div>
                )}
            </div>

            <div className='w-main m-auto my-10 flex justify-end'>
                <Pagination totalCount={counts} />
            </div>

            <div className='h-[100px]'></div>
        </div>
    )
}
export default Products