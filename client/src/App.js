import React, {useEffect} from 'react';
import {Route, Routes} from 'react-router-dom'
import {Login, Home, Public, FAQ, Service, DetailProduct, Blogs, 
Products, FinalRegister, ResetPassword, DetailCart} from './pages/public'
import {AdminLayout, Dashboard, CreateProducts, ManageOrder, ManagerProducts, ManageUser} from './pages/admin'
import {Checkout, History, MemberLayout, MyCart, Personal, WishList} from './pages/member'
import path from './ultils/path'
import { useDispatch,useSelector } from 'react-redux';
import { getCategories } from './store/app/asyncActions';
import { ToastContainer, Bounce } from 'react-toastify';
import { Modal, Cart} from './components';


function App() {
  const dispatch = useDispatch()
  const {isShowModal, modalChildren, isShowCart} = useSelector(state => state.app)
  useEffect(() => {
    dispatch(getCategories())
  }, [])
  return (
    <div className="font-main relative">
      {/* Cart */}
      {isShowCart && (
                <div className='fixed inset-0 bg-overlay z-50 flex justify-end'>
                    <Cart />
                </div>
            )}
      {/* Modal */}
      {isShowModal && <Modal>{modalChildren}</Modal>}
      {/* Public Routes */}
      <Routes>
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.DETAIL_PRODUCT__CATEGORY__PID__TILE} element={<DetailProduct />} />
          <Route path={path.BLOGS} element={<Blogs />} />
          <Route path={path.FAQ} element={<FAQ />} />
          <Route path={path.PRODUCTS} element={<Products />} />
          <Route path={path.OUR_SERVICES} element={<Service />} />
          <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={path.MY_CART} element={<DetailCart />} />
          <Route path={path.CHECKOUT} element={<Checkout />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path={path.ADMIN} element={<AdminLayout />}>
          <Route path={path.DASHBOARD} element={<Dashboard />} />
          <Route path={path.CREATE_PRODUCTS} element={<CreateProducts />} />
          <Route path={path.MANAGE_ORDER} element={<ManageOrder />} />
          <Route path={path.MANAGER_PRODUCTS} element={<ManagerProducts />} />
          <Route path={path.MANAGE_USER} element={<ManageUser />} />
        </Route>
          
        {/* Member Routes */}
        <Route path={path.MEMBER} element={<MemberLayout />}>
          <Route path={path.PERSONAL} element={<Personal />} />
          <Route path={path.MY_CART} element={<MyCart id='cart' />} />
          <Route path={path.HISTORY} element={<History />} />
          <Route path={path.WISHLIST} element={<WishList />} />
          
        </Route>

          <Route path={path.LOGIN} element={<Login />} />
          <Route path={path.FINAL_REGISTER} element={<FinalRegister />} />
      </Routes>

      {/* Thông báo Toast */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
        />

        <ToastContainer/>
    </div>
  );
}

export default App;
