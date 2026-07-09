import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import ToastContainer from './components/ToastContainer';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy loaded pages for code splitting
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Home = lazy(() => import('./pages/Home'));
const Search = lazy(() => import('./pages/Search'));
const RestaurantDetails = lazy(() => import('./pages/RestaurantDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Payment = lazy(() => import('./pages/Payment'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetails = lazy(() => import('./pages/OrderDetails'));
const Profile = lazy(() => import('./pages/Profile'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Offers = lazy(() => import('./pages/Offers'));
const Help = lazy(() => import('./pages/Help'));
const About = lazy(() => import('./pages/About'));
const SelectLocation = lazy(() => import('./pages/SelectLocation'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminRestaurants = lazy(() => import('./pages/admin/AdminRestaurants'));
const AdminFoods = lazy(() => import('./pages/admin/AdminFoods'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons'));

const PageLoader = () => (
  <div className="loading-overlay" style={{ minHeight: '60vh' }}>
    <div className="spinner" />
  </div>
);

// Layout wrapper for pages that need Navbar + Footer
const MainLayout = ({ children, showFooter = true }) => (
  <>
    <Navbar />
    <main id="main-content">{children}</main>
    {showFooter && <Footer />}
  </>
);

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <ToastContainer />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<MainLayout><Landing /></MainLayout>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/about" element={<MainLayout><About /></MainLayout>} />
                  <Route path="/help" element={<MainLayout><Help /></MainLayout>} />
                  <Route path="/offers" element={<MainLayout><Offers /></MainLayout>} />

                  {/* Protected User routes */}
                  <Route path="/select-location" element={
                    <ProtectedRoute><MainLayout><SelectLocation /></MainLayout></ProtectedRoute>
                  } />
                  <Route path="/home" element={
                    <ProtectedRoute><MainLayout><Home /></MainLayout></ProtectedRoute>
                  } />
                  <Route path="/search" element={<MainLayout><Search /></MainLayout>} />
                  <Route path="/restaurants/:id" element={<MainLayout><RestaurantDetails /></MainLayout>} />
                  <Route path="/cart" element={
                    <ProtectedRoute><MainLayout showFooter={false}><Cart /></MainLayout></ProtectedRoute>
                  } />
                  <Route path="/checkout" element={
                    <ProtectedRoute><MainLayout showFooter={false}><Checkout /></MainLayout></ProtectedRoute>
                  } />
                  <Route path="/payment" element={
                    <ProtectedRoute><MainLayout showFooter={false}><Payment /></MainLayout></ProtectedRoute>
                  } />
                  <Route path="/order-success/:orderId" element={
                    <ProtectedRoute><MainLayout><OrderSuccess /></MainLayout></ProtectedRoute>
                  } />
                  <Route path="/orders" element={
                    <ProtectedRoute><MainLayout><Orders /></MainLayout></ProtectedRoute>
                  } />
                  <Route path="/orders/:id" element={
                    <ProtectedRoute><MainLayout><OrderDetails /></MainLayout></ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute><MainLayout><Profile /></MainLayout></ProtectedRoute>
                  } />
                  <Route path="/favorites" element={
                    <ProtectedRoute><MainLayout><Favorites /></MainLayout></ProtectedRoute>
                  } />

                  {/* Admin routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
                  } />
                  <Route path="/admin/restaurants" element={
                    <ProtectedRoute adminOnly><AdminRestaurants /></ProtectedRoute>
                  } />
                  <Route path="/admin/foods" element={
                    <ProtectedRoute adminOnly><AdminFoods /></ProtectedRoute>
                  } />
                  <Route path="/admin/categories" element={
                    <ProtectedRoute adminOnly><AdminCategories /></ProtectedRoute>
                  } />
                  <Route path="/admin/orders" element={
                    <ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>
                  } />
                  <Route path="/admin/users" element={
                    <ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>
                  } />
                  <Route path="/admin/coupons" element={
                    <ProtectedRoute adminOnly><AdminCoupons /></ProtectedRoute>
                  } />

                  {/* Redirects & 404 */}
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </Suspense>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
