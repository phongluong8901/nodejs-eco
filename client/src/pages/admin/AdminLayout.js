import React from 'react'
import {Outlet, Navigate} from 'react-router-dom'
import path from '../../ultils/path'
import {useSelector} from 'react-redux'
import {AdminSidebar} from '../../components'

const AdminLayout = () => {
    const {isLoggedIn, current} = useSelector(state => state.user)
    
    if (!isLoggedIn || !current || +current.role !== 1945) {
        return <Navigate to={`/${path.LOGIN}`} replace={true} />
    }

    return (
        <div className='flex w-full bg-white min-h-screen relative text-gray-800'>
            {/* Sidebar cố định */}
            <div className='w-[327px] top-0 bottom-0 flex-none fixed z-50'>
                <AdminSidebar />
            </div>

            {/* Div đệm để tránh nội dung bị Sidebar đè lên */}
            <div className='w-[327px] flex-none'></div>

            {/* Phần nội dung chính */}
            <div className='flex-auto min-h-screen overflow-y-auto bg-gray-50'>
                <Outlet />
            </div>
        </div>
    )
}

export default AdminLayout