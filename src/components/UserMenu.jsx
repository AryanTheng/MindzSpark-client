import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Divider from './Divider';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { logout } from '../store/userSlice';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { HiOutlineExternalLink, HiOutlineLogout, HiOutlineUser, HiOutlineShoppingBag, HiOutlineHeart, HiOutlineHome, HiOutlineCollection, HiOutlineTag, HiOutlineUpload, HiOutlinePhotograph, HiOutlineViewGrid, HiOutlineClipboardList } from "react-icons/hi";
import { FaBell } from "react-icons/fa";
import isAdmin from '../utils/isAdmin';

const NavItem = ({ to, icon, children, onClick, badge = null, onItemClick }) => {
  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (onItemClick) onItemClick();
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className="flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 rounded-md hover:bg-gray-50 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <span className="text-gray-500 group-hover:text-primary-500 transition-colors">
          {React.cloneElement(icon, { size: 18 })}
        </span>
        <span className="whitespace-nowrap">{children}</span>
      </div>
      {badge !== null && (
        <span className="bg-red-500 text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center">
          {badge}
        </span>
      )}
    </Link>
  );
};

const UserMenu = ({ close, onItemClick }) => {
   const user = useSelector((state)=> state.user)
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const [wishlistCount, setWishlistCount] = useState(0);

   useEffect(() => {
     const fetchWishlist = async () => {
       try {
         const response = await Axios({
           ...SummaryApi.getWishlist,
         });
         if (response.data.success) {
           setWishlistCount(response.data.data?.length || 0);
         }
       } catch (error) {
         setWishlistCount(0);
       }
     };
     fetchWishlist();
   }, []);

   const handleLogout = async()=>{
        try {
          const response = await Axios({
             ...SummaryApi.logout
          })
          console.log("logout",response)
          if(response.data.success){
            if(close){
              close()
            }
            dispatch(logout())
            localStorage.clear()
            toast.success(response.data.message)
            navigate("/")
          }
        } catch (error) {
          console.log(error)
          AxiosToastError(error)
        }
   }

   const handleClose = (e) => {
    if (close) {
      close(e);
    }
    if (onItemClick) {
      onItemClick();
    }
  }
  return (
    <div className='bg-white rounded-lg shadow-lg p-4 w-64'>
        <div className='flex items-center justify-between mb-3 pb-2 border-b'>
            <div>
                <div className='text-lg font-semibold text-gray-800'>My Account</div>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <HiOutlineUser className='text-primary-500' />
                    <span className='max-w-40 text-ellipsis line-clamp-1'>{user.name || user.mobile}</span>
                    {user.role === "ADMIN" && (
                        <span className='bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-2 py-0.5 rounded-full'>Admin</span>
                    )}
                </div>
            </div>
            <Link 
                onClick={handleClose} 
                to={"/admin/profile"} 
                className='p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-primary-500'
                title="View Profile"
            >
                <HiOutlineExternalLink size={16}/>
            </Link>
        </div>

        <div className='space-y-1 py-1'>
            {isAdmin(user.role) && (
                <>
                    <div className='px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider'>Admin Panel</div>
                    <NavItem icon={<HiOutlineCollection />} to="/admin/category" onClick={handleClose} onItemClick={onItemClick}>Category</NavItem>
                    <NavItem icon={<HiOutlineTag />} to="/admin/subcategory" onClick={handleClose} onItemClick={onItemClick}>Sub Category</NavItem>
                    <NavItem icon={<HiOutlineUpload />} to="/admin/upload-product" onClick={handleClose} onItemClick={onItemClick}>Upload Product</NavItem>
                    <NavItem icon={<HiOutlineViewGrid />} to="/admin/product" onClick={handleClose} onItemClick={onItemClick}>Product</NavItem>
                    <NavItem 
                        icon={<FaBell className="flex-shrink-0" />} 
                        to="/admin/notifications" 
                        onClick={handleClose}
                        onItemClick={onItemClick}
                    >
                        Notification Management
                    </NavItem>
                    <NavItem icon={<HiOutlinePhotograph />} to="/admin/banners" onClick={handleClose} onItemClick={onItemClick}>Banner Manager</NavItem>
                    <NavItem icon={<HiOutlineClipboardList />} to="/admin/oms-dashboard" onClick={handleClose} onItemClick={onItemClick}>OMS Dashboard</NavItem>
                    <div className='border-t my-1'></div>
                </>
            )}

            <div className='px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider'>My Account</div>
            <NavItem icon={<HiOutlineShoppingBag />} to="/admin/myorders" onClick={handleClose} onItemClick={onItemClick}>My Orders</NavItem>
            <NavItem 
                icon={<HiOutlineHeart />} 
                to="/wishlist" 
                onClick={handleClose}
                onItemClick={onItemClick}
                badge={wishlistCount > 0 ? wishlistCount : null}
            >
                My Wishlist
            </NavItem>
            <NavItem icon={<HiOutlineHome />} to="/admin/address" onClick={handleClose} onItemClick={onItemClick}>Saved Addresses</NavItem>
            
            <button 
                onClick={handleLogout} 
                className='w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors mt-2'
            >
                <HiOutlineLogout size={18} />
                <span>Log Out</span>
            </button>
        </div>
    </div>
  )
}

export default UserMenu
