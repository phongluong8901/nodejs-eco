import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useSearchParams, useNavigate, createSearchParams, useLocation } from 'react-router-dom'
import { Breadcrumb, Product, SearchItem } from '../../components' 
import Pagination from '../../components/pagination/Pagination'
import { apiGetProducts } from '../../apis'
import Masonry from 'react-masonry-css'

const breakpointColumnsObj = { default: 4, 1100: 3, 700: 2, 500: 1 };

const Products = () => {
    const [products, setProducts] = useState(null)
    const [counts, setCounts] = useState(0) // Lưu tổng số sản phẩm để phân trang
    const [activeClick, setActiveClick] = useState(null)
    const { category } = useParams()
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const location = useLocation()

    const fetchProductByCategory = async (queries) => {
        const response = await apiGetProducts(queries)
        if (response.success) {
            setProducts(response.products)
            setCounts(response.counts) // Quan trọng: Lưu counts từ API trả về
        }
    }

    useEffect(() => {
        const queries = Object.fromEntries([...params])
        if (category && category !== 'products') queries.category = category
        else delete queries.category

        const priceQuery = {}
        if (queries.from) priceQuery.gte = queries.from
        if (queries.to) priceQuery.lte = queries.to
        if (Object.keys(priceQuery).length > 0) queries.price = priceQuery
        
        delete queries.from
        delete queries.to

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
                    <h3 className='font-bold uppercase'>{category === 'products' ? 'All Products' : category}</h3>
                    <Breadcrumb category={category} />
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

            <div className='mt-8 w-main m-auto'>
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
            </div>

            {/* PHẦN PHÂN TRANG */}
            <div className='w-main m-auto my-10 flex justify-end'>
                <Pagination totalCount={counts} />
            </div>

            <div className='h-[100px]'></div>
        </div>
    )
}
export default Products