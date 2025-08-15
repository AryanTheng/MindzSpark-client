import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/OtpVerification";
import VerifyEmail from "../pages/VerifyEmail";
import ResetPassword from "../pages/ResetPassword";
import UserMenuMobile from "../pages/UserMenuMobile";
import Dashboard from "../layouts/Dashboard";
import Profile from "../pages/Profile";
import MyOrders from "../pages/MyOrders";
import Address from "../pages/Address";
import CategoryPage from "../pages/CategoryPage";
import SubCategoryPage from "../pages/SubCategoryPage";
import UploadProduct from "../pages/UploadProduct";
import ProductAdmin from "../pages/ProductAdmin";
import AdminPermision from "../layouts/AdminPermision";
import ProductListPage from "../pages/ProductListPage";
import ProductDisplayPage from "../pages/ProductDisplayPage";
import CartMobile from "../pages/CartMobile";
import CheckoutPage from "../pages/CheckoutPage";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";
import ContactUs from '../pages/ContactUs';
import AboutUs from '../pages/AboutUs';
import Careers from '../pages/Careers';
import MindzsparkStories from '../pages/MindzsparkStories';
import Press from '../pages/Press';
import Payments from '../pages/Payments';
import Shipping from '../pages/Shipping';
import CancellationReturns from '../pages/CancellationReturns';
import TermsOfUse from '../pages/TermsOfUse';
import Security from '../pages/Security';
import Privacy from '../pages/Privacy';
import Sitemap from '../pages/Sitemap';
import GrievanceRedressal from '../pages/GrievanceRedressal';
import EPRCompliance from '../pages/EPRCompliance';
import Wishlist from '../pages/Wishlist';
import ComparePage from '../pages/ComparePage';
import OrderDetails from "../pages/OrderDetails";
import NotificationManager from "../components/NotificationManager";
import BannerManager from "../components/BannerManager";
import OMSDashboard from "../pages/OMSDashboard";
import OMSLayout from "../layouts/OMSLayout";
import OMSOverview from "../pages/oms/OMSOverview";
import OMSOrders from "../pages/oms/OMSOrders";
import OMSProducts from "../pages/oms/OMSProducts";
import OMSInventory from "../pages/oms/OMSInventory";
import OMSPayments from "../pages/oms/OMSPayments";
import OMSAnalytics from "../pages/oms/OMSAnalytics";
import OMSCustomers from "../pages/oms/OMSCustomers";
import OMSSettings from "../pages/oms/OMSSettings";
import OMSSupport from "../pages/oms/OMSSupport";

const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            {
                path : "",
                element : <Home/>
            },
            {
                path : "search",
                element : <SearchPage/>
            },
            {
                path : 'login',
                element : <Login/>
            },
            {
                path : "register",
                element : <Register/>
            },
            {
                path : "forgot-password",
                element : <ForgotPassword/>
            },
            {
                path : "verification-otp",
                element : <OtpVerification/>
            },
            {
                path : "verify-email",
                element : <VerifyEmail/>
            },
            {
                path : "reset-password",
                element : <ResetPassword/>
            },
            {
                path : "user",
                element : <UserMenuMobile/>
            },
            {
                path : "admin",
                element : <Dashboard/>,
                children : [
                    {
                        path : "profile",
                        element : <Profile/>
                    },
                    {
                        path : "myorders",
                        element : <MyOrders/>
                    },
                    {
                        path : "address",
                        element : <Address/>
                    },
                    {
                        path : 'category',
                        element : <AdminPermision><CategoryPage/></AdminPermision>
                    },
                    {
                        path : "subcategory",
                        element : <AdminPermision><SubCategoryPage/></AdminPermision>
                    },
                    {
                        path : 'upload-product',
                        element : <AdminPermision><UploadProduct/></AdminPermision>
                    },
                    {
                        path : 'product',
                        element : <AdminPermision><ProductAdmin/></AdminPermision>
                    },
                    {
                        path : 'notifications',
                        element : <AdminPermision><NotificationManager/></AdminPermision>
                    },
                    {
                        path : 'banners',
                        element : <AdminPermision><BannerManager/></AdminPermision>
                    },
                    {
                        path : 'oms-dashboard',
                        element : <AdminPermision><OMSDashboard/></AdminPermision>
                    }
                ]
            },
            {
                path : ":category",
                children : [
                    {
                        path : ":subCategory",
                        element : <ProductListPage/>
                    }
                ]
            },
            {
                path : "product/:product",
                element : <ProductDisplayPage/>
            },
            {
                path : 'cart',
                element : <CartMobile/>
            },
            {
                path : "checkout",
                element : <CheckoutPage/>
            },
            {
                path : "success",
                element : <Success/>
            },
            {
                path : 'cancel',
                element : <Cancel/>
            },
            {
                path : "contact-us",
                element : <ContactUs/>
            },
            {
                path : "about-us",
                element : <AboutUs/>
            },
            {
                path : "careers",
                element : <Careers/>
            },
            {
                path : "mindzspark-stories",
                element : <MindzsparkStories/>
            },
            {
                path : "press",
                element : <Press/>
            },
            {
                path : "payments",
                element : <Payments/>
            },
            {
                path : "shipping",
                element : <Shipping/>
            },
            {
                path : "cancellation-returns",
                element : <CancellationReturns/>
            },
            {
                path : "terms-of-use",
                element : <TermsOfUse/>
            },
            {
                path : "security",
                element : <Security/>
            },
            {
                path : "privacy",
                element : <Privacy/>
            },
            {
                path : "sitemap",
                element : <Sitemap/>
            },
            {
                path : "grievance-redressal",
                element : <GrievanceRedressal/>
            },
            {
                path : "epr-compliance",
                element : <EPRCompliance/>
            },
            {
                path : "wishlist",
                element : <Wishlist/>
            },
            {
                path : "compare",
                element : <ComparePage/>
            },
            {
                path : "order/:orderId",
                element : <OrderDetails/>
            },
            {
                path : "admin/oms-dashboard",
                element : <AdminPermision><OMSLayout/></AdminPermision>,
                children : [
                    {
                        path : "",
                        element : <OMSOverview/>
                    },
                    {
                        path : "orders",
                        element : <OMSOrders/>
                    },
                    {
                        path : "products",
                        element : <OMSProducts/>
                    },
                    {
                        path : "inventory",
                        element : <OMSInventory/>
                    },
                    {
                        path : "payments",
                        element : <OMSPayments/>
                    },
                    {
                        path : "analytics",
                        element : <OMSAnalytics/>
                    },
                    {
                        path : "customers",
                        element : <OMSCustomers/>
                    },
                    {
                        path : "settings",
                        element : <OMSSettings/>
                    },
                    {
                        path : "support",
                        element : <OMSSupport/>
                    }
                ]
            }
        ]
    }
])

export default router