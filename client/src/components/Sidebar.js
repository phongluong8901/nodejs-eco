import React, { useState, useEffect } from 'react'
import { apiGetCategories } from '../apis/app'
import { NavLink } from 'react-router-dom'
import { createSlug } from '../ultils/helpers'

const Sidebar = () => {
    const [categories, setCategories] = useState(null)

    const fetchCategories = async () => {
        const response = await apiGetCategories()
        // Kiểm tra đúng key trả về từ API (thường là response.productCategories hoặc data)
        if (response.success) setCategories(response.prodCategories)
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    return (
        <div className='flex flex-col border'>
            {/* Thường Sidebar sẽ có một tiêu đề header */}
            <span className='px-5 py-[10px] bg-main text-white font-semibold text-[16px]'>
                ALL CATEGORIES
            </span>
            
            {categories?.map(el => (
                <NavLink
                    key={createSlug(el.title)}
                    to={createSlug(el.title)}
                    // Fix lỗi return ở đây bằng cách dùng ngoặc tròn ()
                    className={({ isActive }) => 
                        isActive 
                        ? 'bg-main text-white px-5 pt-[15px] pb-[14px] text-sm' 
                        : 'px-5 pt-[15px] pb-[14px] text-sm hover:text-main'
                    }
                >
                    {el.title}
                </NavLink>
            ))}
        </div>
    )
}

export default Sidebar