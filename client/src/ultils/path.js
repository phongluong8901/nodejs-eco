const path = {
    PUBLIC: '/',
    HOME: '',
    ALL: '*',
    LOGIN: 'login',
    PRODUCTS:':category',
    BLOGS: 'blogs',
    OUR_SERVICES:'services',
    FAQ: 'faq',
    DETAIL_PRODUCT__CATEGORY__PID__TILE: ':category/:pid/:title',
    PRODUCTS: 'products/:category',
    FINAL_REGISTER: 'finalregister/:status',
    RESET_PASSWORD: 'reset-password/:token',
    DETAIL_CART: 'my-cart',


    //Admin
    ADMIN: 'admin',
    DASHBOARD: 'dashboard',
    CREATE_PRODUCTS: 'create-products',
    MANAGER_PRODUCTS: 'manager-products',
    MANAGE_ORDER: 'manage-order',
    MANAGE_USER: 'manage-user',

    //Member
    MEMBER: 'member',
    PERSONAL: 'personal',
    MY_CART: 'my-cart',
    HISTORY: 'buy-history',
    WISHLIST: 'wishlist',
    CHECKOUT: 'checkout',

}

export default path