import React, { Fragment, useState, useEffect } from 'react'
import logo from '../../assets/logo.png'
import icons from '../../ultils/icons'
import { Link } from 'react-router-dom'
import path from '../../ultils/path'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/user/userSlice' // Giả định bạn có action logout

const { RiPhoneFill, MdEmail, BsHandbagFill, FaUserCircle } = icons

const Header = () => {
    const dispatch = useDispatch()
    const { current } = useSelector(state => state.user)
    const [isShowOption, setIsShowOption] = useState(false)

    // Xử lý Click Outside giống video [14:13]
    useEffect(() => {
        const handleClickOutside = (e) => {
            const profileElement = document.getElementById('profile-dropdown')
            // Nếu click ra ngoài vùng chứa profile thì đóng menu
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
                {/* Liên hệ & Email giữ nguyên */}
                <div className='flex flex-col px-6 border-r items-center justify-center'>
                    <span className='flex gap-4 items-center'>
                        <RiPhoneFill color='red' />
                        <span className='font-semibold'>(+1800) 000 8808</span>
                    </span>
                    <span>Mon-Sat 9:00AM - 8:00PM</span>
                </div>

                <div className='flex flex-col px-6 border-r items-center justify-center'>
                    <span className='flex gap-4 items-center'>
                        <MdEmail color='red' />
                        <span className='font-semibold'>support@tadathemes.com</span>
                    </span>
                    <span>Online Support 24/7</span>
                </div>

                {current && (
                    <Fragment>
                        <div className='flex items-center px-6 border-r justify-center gap-2 cursor-pointer'>
                            <BsHandbagFill color='red' />
                            <span>{`${current?.cart?.length || 0} item(s)`}</span>
                        </div>
                        
                        {/* Thêm id="profile-dropdown" để xử lý click outside [17:42] */}
                        <div 
                            id="profile-dropdown"
                            onClick={() => setIsShowOption(prev => !prev)}
                            className='flex items-center px-6 justify-center gap-2 cursor-pointer relative'
                        >
                            <FaUserCircle size={24} color='red' />
                            <span className='hover:text-red-500'>Profile</span>

                            {isShowOption && (
                                <div 
                                    onClick={e => e.stopPropagation()} 
                                    className='absolute top-full right-0 bg-white border shadow-md min-w-[150px] py-2 flex flex-col z-50'
                                >
                                    <Link 
                                        className='p-2 w-full hover:bg-sky-100' 
                                        to={`/${path.MEMBER}/${path.PERSONAL}`}
                                    >
                                        Personal
                                    </Link>
                                    
                                    {/* Kiểm tra Role Admin: 1945 [12:39] */}
                                    {+current?.role === 1945 && (
                                        <Link 
                                            className='p-2 w-full hover:bg-sky-100' 
                                            to={`/${path.ADMIN}/${path.DASHBOARD}`}
                                        >
                                            Admin Workspace
                                        </Link>
                                    )}
                                    
                                    <span 
                                        onClick={() => dispatch(logout())}
                                        className='p-2 w-full hover:bg-sky-100 cursor-pointer border-t'
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