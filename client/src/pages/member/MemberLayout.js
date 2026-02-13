import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import path from '../../ultils/path'
import { useSelector } from 'react-redux'
import { MemberSidebar } from '../../components'

const MemberLayout = () => {
    const { isLoggedIn, current } = useSelector(state => state.user)

    if (!isLoggedIn || !current) return <Navigate to={`/${path.LOGIN}`} replace={true} />

    return (
        <div className='flex w-full bg-gray-50 min-h-screen relative text-gray-900'>
            {/* Sidebar cố định bên trái */}
            <div className='w-[250px] flex-none fixed top-0 bottom-0 z-50'>
                <MemberSidebar />
            </div>

            {/* Div đệm để đẩy nội dung sang phải, tránh bị Sidebar đè */}
            <div className='w-[250px] flex-none'></div>

            {/* Content chính của Member */}
            <div className='flex-auto min-h-screen flex flex-col'>
                <Outlet />
            </div>
        </div>
    )
}

export default MemberLayout