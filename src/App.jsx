import React, { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Outlet } from "react-router-dom";
import Home from './components/Home';
import { useDispatch, useSelector } from 'react-redux';
import Loading from './components/Loading';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import LayoutAdmin from './components/Admin/LayoutAdmin';
import './styles/reset.scss';
import './styles/global.scss';
import './styles/footer.scss';
import ManageUserPage from './pages/admin/user';
import OrderPage from './pages/order';
import HistoryPage from './pages/history';
import AdminOrderPage from './pages/admin/order';
import ProductPage from './pages/product';
import ContactPage from './pages/contact';
import LoginPage from './pages/login';
import Header from './components/Header';
import { Footer } from 'antd/es/layout/layout';
import RegisterPage from './pages/register';
import { callFetchAccount } from './services/api';
import { doGetAccountAction } from './redux/account/accountSlice';
import AdminPage from './pages/admin';
import ManageProductPage from './pages/admin/product';
import Payment from './pages/payment';

const Layout = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className='layout-app'>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className='content'>
        <Outlet context={[searchTerm, setSearchTerm]} />
      </div>
      <Footer className='footer' style={{
        textAlign: 'center',
      }}> React Shop ©{new Date().getFullYear()} Created by Lam Tien Duong</Footer>
    </div>
  )
}

export default function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.account.isLoading);

  const getAccount = async () => {
    if (
      window.location.pathname === '/login'
      || window.location.pathname === '/register'
    )
      return;

    const res = await callFetchAccount();
    if (res && res.data && res.data.user) {
      dispatch(doGetAccountAction(res.data))
    }
  }

  useEffect(() => {
    getAccount();
  }, [])

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "contact",
          element: <ContactPage />,
        },
        {
          path: "product/:slug",
          element: <ProductPage />,
        },
        {
          path: "order",
          element:
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          ,
        },
        {
          path: "history",
          element:
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          ,
        },
      ],
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <NotFound />,
      children: [
        {
          index: true, element:
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
        },
        {
          path: "users",
          element:
            <ProtectedRoute>
              <ManageUserPage />
            </ProtectedRoute>
          ,
        },
        {
          path: "products",
          element:
            <ProtectedRoute>
              <ManageProductPage />
            </ProtectedRoute>
          ,
        },
        {
          path: "orders",
          element:
            <ProtectedRoute>
              <AdminOrderPage />
            </ProtectedRoute>
          ,
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/payment",
      element: <Payment />,
    },
  ]);

  return (
    <>
      {
        isLoading === false
          || window.location.pathname === '/login'
          || window.location.pathname === '/register'
          || window.location.pathname === '/'
          || window.location.pathname.startsWith('/book')
          ?
          <RouterProvider router={router} />
          :
          <Loading />
      }
    </>
  )
}
