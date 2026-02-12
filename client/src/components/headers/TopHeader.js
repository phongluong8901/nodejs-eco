import React, { memo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import path from '../../ultils/path'
import { getCurrent } from '../../store/user/asyncActions'
import { useDispatch, useSelector } from 'react-redux'
import icons from '../../ultils/icons'
// Import thêm clearMessage từ userSlice
import { logout, clearMessage } from '../../store/user/userSlice' 
import Swal from 'sweetalert2'

const { AiOutlineLogout } = icons

const TopHeader = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isLoggedIn, current, mes } = useSelector(state => state.user)

    // 1. Fetch user data khi đã login
    useEffect(() => {
        if (isLoggedIn) {
            dispatch(getCurrent())
        }
    }, [dispatch, isLoggedIn])

    // 2. Xử lý thông báo hết hạn phiên đăng nhập
    useEffect(() => {
        if (mes) {
            Swal.fire('Oops!', mes, 'info').then(() => {
                // QUAN TRỌNG: Reset lại mes về rỗng để không bị lặp lại Alert
                dispatch(clearMessage()) 
                navigate(`/${path.LOGIN}`)
            })
        }
    }, [mes, dispatch, navigate]) // Thêm dispatch vào dependencies

    return (
        <div className='h-[38px] w-full bg-main flex items-center justify-center'>
            <div className='w-main flex items-center justify-between text-xs text-white'>
                <span>ORDER ONLINE OR CALL US (+1800) 000 8808</span>
                
                {isLoggedIn && current 
                    ? <div className='flex gap-4 items-center'>
                        <span>{`Welcome, ${current?.firstname} ${current?.lastname}`}</span>
                        <span 
                            onClick={() => dispatch(logout())}
                            className='cursor-pointer hover:rounded-full hover:bg-gray-200 hover:text-main p-2 transition-all'
                        >
                            <AiOutlineLogout size={16}/>
                        </span>
                      </div>
                    : <Link className='hover:text-gray-800' to={`/${path.LOGIN}`}>
                        Sign In or Create Account
                      </Link>
                }
            </div>
        </div>
    )
}

export default memo(TopHeader)