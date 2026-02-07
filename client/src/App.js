import React, {useEffect} from 'react';
import {Route, Routes} from 'react-router-dom'
import {Login, Home, Public, FAQ, Service, DetailProduct, Blogs, 
Products, FinalRegister, ResetPassword} from './pages/public'
import path from './ultils/path'
import { useDispatch } from 'react-redux';
import { getCategories } from './store/app/asyncActions';
import { ToastContainer, Bounce } from 'react-toastify';

function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getCategories())
  }, [])
  return (
    <div className="min-h-screen font-main">
      <Routes>
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.DETAIL_PRODUCT__PID__TILE} element={<DetailProduct />} />
          <Route path={path.BLOGS} element={<Blogs />} />
          <Route path={path.FAQ} element={<FAQ />} />
          <Route path={path.PRODUCTS} element={<Products />} />
          <Route path={path.OUR_SERVICES} element={<Service />} />
          <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />

        </Route>
        <Route path={path.LOGIN} element={<Login />} />
          <Route path={path.FINAL_REGISTER} element={<FinalRegister />} />
      </Routes>

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
