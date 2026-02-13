import React, {memo} from 'react'

// Sửa lại file Button.js để nhận cả name lẫn children
const Button = ({children, handleOnClick, style, fw, name}) => {
    return (
        <button
            type='button'
            className={style ? style : `px-4 py-2 rounded-md text-white bg-main text-semibold my-2 ${fw ? 'w-full' : 'w-fit'}`}
            onClick={() => {
                handleOnClick && handleOnClick()
            }}
        >
            {/* Nếu có children thì hiện children, không thì hiện name */}
            {children ? children : name}
        </button>
    )
}

export default memo(Button)