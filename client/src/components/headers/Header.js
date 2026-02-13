import React, { Fragment, useState, useEffect } from 'react'
import logo from '../../assets/logo.png'
import icons from '../../ultils/icons'
import { Link } from 'react-router-dom'
import path from '../../ultils/path'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/user/userSlice' 
import { showCart } from '../../store/app/appSlice'

const { RiPhoneFill, MdEmail, BsHandbagFill, FaUserCircle } = icons

const Header = () => {
    const dispatch = useDispatch()
    const { current } = useSelector(state => state.user)
    const [isShowOption, setIsShowOption] = useState(false)

    // Debug để xem "nội tạng" của current
    useEffect(() => {
        if (current) console.log('Dữ liệu User hiện tại:', current)
    }, [current])

    useEffect(() => {
        const handleClickOutside = (e) => {
            const profileElement = document.getElementById('profile-dropdown')
            if (!profileElement?.contains(e.target)) {
                setIsShowOption(false)
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])

    return (
        <div className='w-main flex justify-between h-[110px] py-[35px]'>
            <Link to={`/${path.HOME}`}>
                <img src={logo} alt="logo" className='w-[234px] object-contain' />
            </Link>

            <div className='flex text-[13px]'>
                <div className='flex flex-col px-6 border-r items-center justify-center text-gray-500'>
                    <span className='flex gap-4 items-center'>
                        <RiPhoneFill color='red' />
                        <span className='font-semibold text-black'>(+1800) 000 8808</span>
                    </span>
                    <span>Mon-Sat 9:00AM - 8:00PM</span>
                </div>

                <div className='flex flex-col px-6 border-r items-center justify-center text-gray-500'>
                    <span className='flex gap-4 items-center'>
                        <MdEmail color='red' />
                        <span className='font-semibold text-black'>support@tadathemes.com</span>
                    </span>
                    <span>Online Support 24/7</span>
                </div>

                {current && (
                    <Fragment>
                        <div 
                            onClick={() => dispatch(showCart())} 
                            className='flex items-center px-6 border-r justify-center gap-2 cursor-pointer hover:text-main'
                        >
                            <BsHandbagFill color='red' />
                            <span>{`${current?.cart?.length || 0} item(s)`}</span>
                        </div>
                        
                        <div 
                            id="profile-dropdown"
                            onClick={() => setIsShowOption(prev => !prev)}
                            className='flex items-center px-6 justify-center gap-2 cursor-pointer relative'
                        >
                            <FaUserCircle size={24} color='red' />
                            <span className='hover:text-main'>Profile</span>

                            {isShowOption && (
                                <div 
                                    onClick={e => e.stopPropagation()} 
                                    className='absolute top-full right-0 bg-white border shadow-md min-w-[150px] py-2 flex flex-col z-50 text-black'
                                >
                                    <Link 
                                        className='p-2 w-full hover:bg-gray-100' 
                                        to={`/${path.MEMBER}/${path.PERSONAL}`}
                                    >
                                        Personal
                                    </Link>
                                    
                                    {/* Sửa logic check Admin: Chấp nhận cả số 1945 hoặc chuỗi '1945' */}
                                    {(current?.role == 1945 || current?.userData?.role == 1945) && (
                                        <Link 
                                            className='p-2 w-full hover:bg-gray-100 text-blue-600 font-semibold' 
                                            to={`/${path.ADMIN}/${path.DASHBOARD}`}
                                        >
                                            Admin Workspace
                                        </Link>
                                    )}
                                    
                                    <span 
                                        onClick={() => dispatch(logout())}
                                        className='p-2 w-full hover:bg-gray-100 cursor-pointer border-t'
                                    >
                                        Logout
                                    </span>
                                </div>
                            )}
                        </div>
                    </Fragment>
                )}
            </div>
        </div>
    )
}

export default Header