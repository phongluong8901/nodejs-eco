import React, { memo } from 'react'
import useBreadcrumbs from 'use-react-router-breadcrumbs'
import { Link } from 'react-router-dom'
import icons from '../ultils/icons'

const { IoIosArrowForward } = icons

const Breadcrumb = ({ title, category }) => {
    // Định nghĩa các route để mapping text hiển thị
    // Chú ý: Cấu trúc path phải khớp với App.js
    const routes = [
        { path: '/', breadcrumb: 'Home' },
        { path: '/:category', breadcrumb: category },
        { path: '/:category/:pid/:title', breadcrumb: title },
    ]

    const breadcrumbs = useBreadcrumbs(routes)

    return (
        <div className='text-sm flex items-center gap-1'>
            {breadcrumbs
                ?.filter(el => el.match.route) // Chỉ lấy các route đã được định nghĩa
                .map(({ match, breadcrumb }, index, array) => (
                    <div key={match.pathname} className='flex items-center gap-1'>
                        <Link 
                            className='flex items-center gap-1 hover:text-main capitalize' 
                            to={match.pathname}
                        >
                            <span className='line-clamp-1'>{breadcrumb}</span>
                        </Link>
                        {/* Hiển thị icon mũi tên nếu không phải phần tử cuối cùng */}
                        {index < array.length - 1 && (
                            <IoIosArrowForward size={10} className='text-gray-400' />
                        )}
                    </div>
                ))
            }
        </div>
    )
}

export default memo(Breadcrumb)