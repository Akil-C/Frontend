import api from './api';

// Auth
export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);
export const refreshToken = (data) => api.post('/auth/refresh', data);
export const logoutUser = () => api.post('/auth/logout');

// User
export const getMyProfile = () => api.get('/user/me');
export const updateMyProfile = (data) => api.put('/user/me', data);

// Public - Restaurants
export const getRestaurants = (params) => api.get('/public/restaurants', { params });
export const getRestaurantById = (id) => api.get(`/public/restaurants/${id}`);
export const getRestaurantMenu = (id, params) => api.get(`/public/restaurants/${id}/menu`, { params });

// Public - Categories
export const getCategories = () => api.get('/public/categories');
export const getCategoryById = (id) => api.get(`/public/categories/${id}`);

// Public - Foods
export const getFoods = (params) => api.get('/public/foods', { params });
export const getFoodById = (id) => api.get(`/public/foods/${id}`);
export const searchFoods = (query, params) => api.get('/public/foods', { params: { search: query, ...params } });

// Public - Reviews
export const getRestaurantReviews = (restaurantId, params) => api.get(`/public/restaurants/${restaurantId}/reviews`, { params });
export const getFoodReviews = (foodId, params) => api.get(`/public/foods/${foodId}/reviews`, { params });

// Public - Coupons
export const getActiveCoupons = () => api.get('/public/coupons');
export const validateCoupon = (code) => api.get('/public/coupons/validate', { params: { code } });

// Cart
export const getCart = () => api.get('/cart');
export const addToCart = (foodId, quantity = 1, notes = '') =>
  api.post(`/cart/add?foodId=${foodId}&quantity=${quantity}${notes ? `&notes=${encodeURIComponent(notes)}` : ''}`);
export const updateCartItem = (cartItemId, quantity) =>
  api.put(`/cart/item/${cartItemId}?quantity=${quantity}`);
export const removeCartItem = (cartItemId) => api.delete(`/cart/item/${cartItemId}`);
export const clearCart = () => api.delete('/cart/clear');

// Orders
export const placeOrder = (data) => api.post('/orders', data);
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const getOrderHistory = (params) => api.get('/orders/history', { params });
export const downloadInvoice = (id) => api.get(`/orders/${id}/invoice`, { responseType: 'blob' });

// Addresses
export const getAddresses = () => api.get('/addresses');
export const createAddress = (data) => api.post('/addresses', data);
export const updateAddress = (id, data) => api.put(`/addresses/${id}`, data);
export const deleteAddress = (id) => api.delete(`/addresses/${id}`);

// Favorites
export const getFavorites = () => api.get('/favorites');
export const addRestaurantFavorite = (restaurantId) => api.post(`/favorites/restaurants/${restaurantId}`);
export const removeRestaurantFavorite = (restaurantId) => api.delete(`/favorites/restaurants/${restaurantId}`);
export const addFoodFavorite = (foodId) => api.post(`/favorites/foods/${foodId}`);
export const removeFoodFavorite = (foodId) => api.delete(`/favorites/foods/${foodId}`);
export const checkRestaurantFavorite = (restaurantId) => api.get(`/favorites/check/restaurant/${restaurantId}`);
export const checkFoodFavorite = (foodId) => api.get(`/favorites/check/food/${foodId}`);

// Reviews
export const addReview = (data) => api.post('/reviews', data);

// Admin
export const getAllUsers = (params) => api.get('/admin/users', { params });
export const getAllOrders = (params) => api.get('/admin/orders', { params });
export const updateOrderStatus = (id, status) => api.put(`/admin/orders/${id}/status?status=${status}`);
export const getDashboardStats = () => api.get('/admin/analytics/dashboard');
export const createRestaurant = (data) => api.post('/admin/restaurants', data);
export const updateRestaurant = (id, data) => api.put(`/admin/restaurants/${id}`, data);
export const deleteRestaurant = (id) => api.delete(`/admin/restaurants/${id}`);
export const createFood = (data) => api.post('/admin/foods', data);
export const updateFood = (id, data) => api.put(`/admin/foods/${id}`, data);
export const deleteFood = (id) => api.delete(`/admin/foods/${id}`);
export const createCategory = (data) => api.post('/admin/categories', data);
export const updateCategory = (id, data) => api.put(`/admin/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/admin/categories/${id}`);
export const createCoupon = (data) => api.post('/admin/coupons', data);
export const updateCoupon = (id, data) => api.put(`/admin/coupons/${id}`, data);
export const deleteCoupon = (id) => api.delete(`/admin/coupons/${id}`);
