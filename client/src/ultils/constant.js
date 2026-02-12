import path from './path'
import icons from './icons'
import { AiOutlineDash } from 'react-icons/ai'

const { RiTruckFill, BsShieldShaded, BsReplyFill, FaTty, AiFillGift, MdGroups,
    TbBrandProducthunt, MdOutlineInventory2, AiOutlineDashboard,
    AiOutlineUser,
    BsCartCheck,
    AiOutlineHistory,
    AiOutlineHeart
 } = icons


export const navigation = [
    { id: 1, value: 'HOME', path: `/${path.HOME}` },
    { id: 2, value: 'PRODUCTS', path: `/${path.PRODUCTS}` },
    { id: 3, value: 'BLOGS', path: `/${path.BLOGS}` },
    { id: 4, value: 'OUR SERVICES', path: `/${path.OUR_SERVICES}` },
    { id: 5, value: 'FAQs', path: `/${path.FAQ}` },
]

export const productExtraInformation = [
    {
        id: 1,
        title: 'Guarantee',
        sub: 'Quality Checked',
        icon: <BsShieldShaded size={20} />,
    },
    {
        id: 2,
        title: 'Free Shipping',
        sub: 'Free On All Products',
        icon: <RiTruckFill size={20} />,
    },
    {
        id: 3,
        title: 'Online Support 24/7',
        sub: 'Technical Support 24/7',
        icon: <FaTty size={20} />,
    },
    {
        id: 4,
        title: 'Gift Cards',
        sub: 'Perfect Gift Ideas',
        icon: <AiFillGift size={20} />,
    },
    {
        id: 5,
        title: 'Free Return',
        sub: 'Within 7 Days',
        icon: <BsReplyFill size={20} />,
    },
]

export const productInfoTabs = [
    { id: 1, name: 'DESCRIPTION', content: 'Description content...' },
    { id: 2, name: 'WARRANTY', content: 'Warranty information...' },
    { id: 3, name: 'DELIVERY', content: 'Delivery policy...' },
    { id: 4, name: 'PAYMENT', content: 'Payment methods...' },
    // { id: 5, name: 'CUSTOMER REVIEW', content: 'Customer reviews section...' },
]

export const colors = [
    'black',
    'brown',
    'white',
    'red',
    'blue',
    'yellow',
    'orange',
    'green',
    'purple',
    'pink'
]

export const voteOptions = [
    {
        id: 1,
        text: 'Terrible'
    },
    {
        id: 2,
        text: 'Bad'
    },
    {
        id: 3,
        text: 'Neutral'
    },
    {
        id: 4,
        text: 'Good'
    },
    {
        id: 5,
        text: 'Perfect'
    },
]

export const adminSidebar = [
    {
        id: 1, 
        type: 'SINGLE', 
        text: 'Dashboard', 
        path: `/${path.ADMIN}/${path.DASHBOARD}`, // Khớp với path.DASHBOARD
        icon: <AiOutlineDashboard size={20} />
    },
    {
        id: 2, 
        type: 'SINGLE', 
        text: 'Manage users', 
        path: `/${path.ADMIN}/${path.MANAGE_USER}`, // Khớp với path.MANAGE_USER
        icon: <MdGroups size={20}/>
    },
    {
        id: 3, 
        type: 'PARENT', 
        text: 'Manage products', 
        icon: <MdOutlineInventory2 size={20}/>,
        submenu: [
            { text: 'Create product', path: `/${path.ADMIN}/${path.CREATE_PRODUCTS}` },
            { text: 'Manage products', path: `/${path.ADMIN}/${path.MANAGER_PRODUCTS}` }, // Khớp với MANAGER_PRODUCTS
        ]
    },
    {
        id: 4, 
        type: 'SINGLE', 
        text: 'Manage orders', 
        path: `/${path.ADMIN}/${path.MANAGE_ORDER}`, // Khớp với path.MANAGE_ORDER
        icon: <RiTruckFill size={20}/>
    },
]

export const roles = [
    {
        code: 1945,
        text: 'Admin'
    },
    {
        code: 1979,
        text: 'User'
    }
]

export const memberSidebar = [
    {
        id: 1,
        type: 'SINGLE',
        text: 'Personal',
        path: `/${path.MEMBER}/${path.PERSONAL}`,
        icon: <AiOutlineUser size={20} />
    },
    {
        id: 2,
        type: 'SINGLE',
        text: 'My Cart',
        path: `/${path.MEMBER}/${path.MY_CART}`,
        icon: <BsCartCheck size={20} />
    },
    {
        id: 3,
        type: 'SINGLE',
        text: 'Buy History',
        path: `/${path.MEMBER}/${path.HISTORY}`,
        icon: <AiOutlineHistory size={20} />
    },
    {
        id: 4,
        type: 'SINGLE',
        text: 'Wishlist',
        path: `/${path.MEMBER}/${path.WISHLIST}`,
        icon: <AiOutlineHeart size={20} />
    },
]