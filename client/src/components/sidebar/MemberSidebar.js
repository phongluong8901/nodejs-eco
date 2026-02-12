import React, { memo, Fragment, useState } from 'react'
import avatarDefault from '../../assets/Avatar.jpg' // Thêm ảnh mặc định nếu có
import { memberSidebar } from '../../ultils/constant'
import { NavLink, Link } from 'react-router-dom'
import clsx from 'clsx'
import { AiOutlineCaretDown, AiOutlineCaretRight } from 'react-icons/ai'
import path from '../../ultils/path'
import { useSelector } from 'react-redux'

const activeStyle = 'px-4 py-3 flex items-center gap-2 bg-blue-600 text-gray-100 border-l-4 border-white'
const notActiveStyle = 'px-4 py-3 flex items-center gap-2 text-gray-200 hover:bg-zinc-700 transition-all'

const MemberSidebar = () => {
    const [actived, setActived] = useState([])
    const { current } = useSelector(state => state.user) // Lấy thông tin user từ Redux

    const handleShowSubmenu = (tabID) => {
        if (actived.some(el => el === tabID)) {
            setActived(prev => prev.filter(el => el !== tabID))
        } else {
            setActived(prev => [...prev, tabID])
        }
    }

    return (
        <div className='bg-zinc-800 h-full py-4 text-white shadow-xl min-h-screen'>
            {/* PHẦN AVATAR & USERNAME [31:13] */}
            <div className='w-full flex flex-col items-center justify-center py-6 gap-2 border-b border-zinc-700 mb-4'>
                <img 
                    src={current?.avatar || avatarDefault} 
                    alt="avatar" 
                    className='w-20 h-20 object-cover rounded-full border-2 border-white shadow-lg' 
                />
                <div className='flex flex-col items-center'>
                    <span className='font-semibold text-lg'>{`${current?.firstname} ${current?.lastname}`}</span>
                    <small className='text-zinc-400 italic'>{current?.role === '1945' ? 'Admin' : 'Member'}</small>
                </div>
            </div>

            <div className='flex flex-col'>
                {/* Đổi từ adminSidebar sang memberSidebar */}
                {memberSidebar.map(el => (
                    <Fragment key={el.id}>
                        {el.type === 'SINGLE' && (
                            <NavLink 
                                to={el.path}
                                className={({ isActive }) => clsx(isActive && activeStyle, !isActive && notActiveStyle)}
                            >
                                <span>{el.icon}</span>
                                <span>{el.text}</span>
                            </NavLink>
                        )}

                        {el.type === 'PARENT' && (
                            <div className='flex flex-col'>
                                <div 
                                    onClick={() => handleShowSubmenu(el.id)}
                                    className='px-4 py-3 flex items-center justify-between gap-2 text-gray-200 cursor-pointer hover:bg-zinc-700'
                                >
                                    <div className='flex items-center gap-2'>
                                        <span>{el.icon}</span>
                                        <span>{el.text}</span>
                                    </div>
                                    {actived.some(id => id === el.id) ? <AiOutlineCaretDown size={14} /> : <AiOutlineCaretRight size={14} />}
                                </div>
                                {actived.some(id => id === el.id) && (
                                    <div className='flex flex-col bg-zinc-900/50 transition-all'>
                                        {el.submenu?.map(item => (
                                            <NavLink 
                                                key={item.text}
                                                to={item.path}
                                                onClick={(e) => e.stopPropagation()} 
                                                className={({ isActive }) => clsx(isActive && activeStyle, !isActive && notActiveStyle, 'pl-10 text-sm')}
                                            >
                                                {item.text}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </Fragment>
                ))}
                
                {/* Nút quay về trang chủ */}
                <Link to={`/${path.HOME}`} className={notActiveStyle}>
                    <span>Quay lại Home</span>
                </Link>
            </div>
        </div>
    )
}

export default memo(MemberSidebar)