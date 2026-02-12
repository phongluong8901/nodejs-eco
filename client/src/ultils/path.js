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
    // DETAIL_PRODUCT: 'san-pham',
    FINAL_REGISTER: 'finalregister/:status',
    RESET_PASSWORD: 'reset-password/:token',


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

}

export default path