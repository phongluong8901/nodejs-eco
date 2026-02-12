import React, { memo, Fragment, useState } from 'react'
import logo from '../../assets/logo.png'
import { adminSidebar } from '../../ultils/constant'
import { NavLink, Link } from 'react-router-dom'
import clsx from 'clsx'
import { AiOutlineCaretDown, AiOutlineCaretRight,  } from 'react-icons/ai'
import path from '../../ultils/path'

const activeStyle = 'px-4 py-2 flex items-center gap-2 bg-blue-600 text-gray-100'
const notActiveStyle = 'px-4 py-2 flex items-center gap-2 text-gray-200 hover:bg-zinc-700'

const AdminSidebar = () => {
    const [actived, setActived] = useState([])

    const handleShowSubmenu = (tabID) => {
        if (actived.some(el => el === tabID)) {
            setActived(prev => prev.filter(el => el !== tabID))
        } else {
            setActived(prev => [...prev, tabID])
        }
    }

    return (
        <div className='bg-zinc-800 h-full py-4 text-white shadow-xl'>
            {/* Logo quay về Home */}
            <Link to={`/${path.HOME}`} className='flex flex-col justify-center items-center gap-2 p-4 mb-6 border-b border-zinc-700'>
                <img src={logo} alt="logo" className='w-[120px] object-contain' />
                <small className='text-zinc-400 font-bold tracking-widest uppercase text-[10px]'>Admin Panel</small>
            </Link>

            <div className='flex flex-col'>
                {adminSidebar.map(el => (
                    <Fragment key={el.id}>
                        {/* Menu đơn (Dashboard, Manage User...) */}
                        {el.type === 'SINGLE' && (
                            <NavLink 
                                to={el.path}
                                className={({ isActive }) => clsx(isActive && activeStyle, !isActive && notActiveStyle)}
                            >
                                <span>{el.icon}</span>
                                <span>{el.text}</span>
                            </NavLink>
                        )}

                        {/* Menu có cấp con (Manage Products) */}
                        {el.type === 'PARENT' && (
                            <div className='flex flex-col'>
                                <div 
                                    onClick={() => handleShowSubmenu(el.id)}
                                    className='px-4 py-2 flex items-center justify-between gap-2 text-gray-200 cursor-pointer hover:bg-zinc-700 transition-all'
                                >
                                    <div className='flex items-center gap-2'>
                                        <span>{el.icon}</span>
                                        <span>{el.text}</span>
                                    </div>
                                    {actived.some(id => id === el.id) ? <AiOutlineCaretDown size={14} /> : <AiOutlineCaretRight size={14} />}
                                </div>

                                {/* Render link con nếu ID menu cha nằm trong state actived */}
                                {actived.some(id => id === el.id) && (
                                    <div className='flex flex-col bg-zinc-900/40'>
                                        {el.submenu?.map(item => (
                                            <NavLink 
                                                key={item.text}
                                                to={item.path}
                                                // Quan trọng: click con không được làm đóng cha
                                                onClick={(e) => e.stopPropagation()} 
                                                className={({ isActive }) => clsx(isActive && activeStyle, !isActive && notActiveStyle, 'pl-10 text-sm py-3')}
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
            </div>
        </div>
    )
}

export default memo(AdminSidebar)