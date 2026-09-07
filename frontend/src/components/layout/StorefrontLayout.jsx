import { Outlet } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import ToastContainer from '../common/Toast';
import './StorefrontLayout.css';

/**
 * StorefrontLayout
 * Wraps all public-facing pages with Navbar and Footer.
 */
export default function StorefrontLayout() {
  return (
    <div className="storefront-layout">
      <Navbar />
      <main id="main-content" className="storefront-layout__main" role="main">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}
