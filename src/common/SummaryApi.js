export const baseURL = import.meta.env.VITE_API_URL

const SummaryApi = {
    register : {
        url : '/api/user/register',
        method : 'post'
    },
    login : {
        url : '/api/user/login',
        method : 'post'
    },
    forgot_password : {
        url : "/api/user/forgot-password",
        method : 'put'
    },
    forgot_password_otp_verification : {
        url : 'api/user/verify-forgot-password-otp',
        method : 'put'
    },
    resetPassword : {
        url : "/api/user/reset-password",
        method : 'put'
    },
    refreshToken : {
        url : 'api/user/refresh-token',
        method : 'post'
    },
    userDetails : {
        url : '/api/user/user-details',
        method : "get"
    },
    logout : {
        url : "/api/user/logout",
        method : 'get'
    },
    uploadAvatar : {
        url : "/api/user/upload-avatar",
        method : 'put'
    },
    updateUserDetails : {
        url : '/api/user/update-user',
        method : 'put'
    },
    addCategory : {
        url : '/api/category/add-category',
        method : 'post'
    },
    uploadImage : {
        url : '/api/file/upload',
        method : 'post'
    },
    getCategory : {
        url : '/api/category/get',
        method : 'get'
    },
    updateCategory : {
        url : '/api/category/update',
        method : 'put'
    },
    deleteCategory : {
        url : '/api/category/delete',
        method : 'delete'
    },
    createSubCategory : {
        url : '/api/subcategory/create',
        method : 'post'
    },
    getSubCategory : {
        url : '/api/subcategory/get',
        method : 'post'
    },
    updateSubCategory : {
        url : '/api/subcategory/update',
        method : 'put'
    },
    deleteSubCategory : {
        url : '/api/subcategory/delete',
        method : 'delete'
    },
    createProduct : {
        url : '/api/product/create',
        method : 'post'
    },
    getProduct : {
        url : '/api/product/get',
        method : 'post'
    },
    getProductByCategory : {
        url : '/api/product/get-product-by-category',
        method : 'post'
    },
    getProductByCategoryAndSubCategory : {
        url : '/api/product/get-pruduct-by-category-and-subcategory',
        method : 'post'
    },
    getProductDetails : {
        url : '/api/product/get-product-details',
        method : 'post'
    },
    updateProductDetails : {
        url : "/api/product/update-product-details",
        method : 'put'
    },
    deleteProduct : {
        url : "/api/product/delete-product",
        method : 'delete'
    },
    searchProduct : {
        url : '/api/product/search-product',
        method : 'post'
    },
    addTocart : {
        url : "/api/cart/create",
        method : 'post'
    },
    getCartItem : {
        url : '/api/cart/get',
        method : 'get'
    },
    updateCartItemQty : {
        url : '/api/cart/update-qty',
        method : 'put'
    },
    deleteCartItem : {
        url : '/api/cart/delete-cart-item',
        method : 'delete'
    },
    createAddress : {
        url : '/api/address/create',
        method : 'post'
    },
    getAddress : {
        url : '/api/address/get',
        method : 'get'
    },
    updateAddress : {
        url : '/api/address/update',
        method : 'put'
    },
    disableAddress : {
        url : '/api/address/disable',
        method : 'delete'
    },
    CashOnDeliveryOrder : {
        url : "/api/order/cash-on-delivery",
        method : 'post'
    },
    payment_url : {
        url : "/api/order/checkout",
        method : 'post'
    },
    getOrderItems : {
        url : '/api/order/order-list',
        method : 'get'
    },
    createRazorpayOrder : {
        url : '/api/order/create-razorpay-order',
        method : 'post'
    },
    verifyRazorpayPayment : {
        url : '/api/order/verify-razorpay-payment',
        method : 'post'
    },
    getReviews: {
        url: '/api/review/get',
        method: 'get'
    },
    addReview: {
        url: '/api/review/add',
        method: 'post'
    },
    addToWishlist: {
        url: '/api/user/wishlist/add',
        method: 'post'
    },
    removeFromWishlist: {
        url: '/api/user/wishlist/remove',
        method: 'post'
    },
    getWishlist: {
        url: '/api/user/wishlist',
        method: 'get'
    },
    addQuestion: {
        url: '/api/question/add',
        method: 'post'
    },
    getQuestions: {
        url: '/api/question/get',
        method: 'get'
    },
    addReply: {
        url: '/api/question/reply',
        method: 'post'
    },
    addToSaveForLater: {
        url: '/api/cart/save-for-later/add',
        method: 'post'
    },
    removeFromSaveForLater: {
        url: '/api/cart/save-for-later/remove',
        method: 'delete'
    },
    getSaveForLater: {
        url: '/api/cart/save-for-later/get',
        method: 'get'
    },
    getAllOrders: {
        url: '/api/order/all-orders',
        method: 'get'
    },
    getTodayOrders: {
        url: '/api/order/today-orders',
        method: 'get'
    },
    // Notification APIs
    createNotification: {
        url: '/api/notification/create',
        method: 'post'
    },
    getAllNotifications: {
        url: '/api/notification/admin/all',
        method: 'get'
    },
    getUserNotifications: {
        url: '/api/notification/user',
        method: 'get'
    },
    updateNotification: {
        url: '/api/notification/admin/update',
        method: 'put'
    },
    deleteNotification: {
        url: '/api/notification/admin/delete',
        method: 'delete'
    },
    markNotificationAsRead: {
        url: '/api/notification/user/read',
        method: 'put'
    },
    getNotificationStats: {
        url: '/api/notification/admin/stats',
        method: 'get'
    },
    getBanner: {
        url:'/api/banner/ban',
        method: 'get'
    },
    confirmOrderEmail: {
        url: '/api/user/confirm-order',
        method: 'put'
    },
    verifyOrderOtp: {
        url: '/api/user/verify-confirm-order',
        method: 'put'
    },
}

export default SummaryApi