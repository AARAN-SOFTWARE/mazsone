import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/app/Home';
import Cart from './pages/app/Cart';
import AppHeader from './Components/Header/AppHeader';
import Footer from './Components/footer/Footer';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/Signup';
import ProductPage from './UIBlocks/ProductPage';
import CategoryPage from './UIBlocks/CategoryPage';
import NotFound from './Components/NotFound';
import ProductForm from './pages/app/Forms/ProductForm';

function AppRoutes() {
  const location = useLocation();
  const hideLayout = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      {!hideLayout && <AppHeader />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/productpage/:id" element={<ProductPage />} />
        <Route path="/category/:category" element={<CategoryPage />} />

        {/* Catch-all route for unmatched paths */}
        <Route path="*" element={<NotFound />} />
        <Route path="/productform" element={<ProductForm />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default AppRoutes;
