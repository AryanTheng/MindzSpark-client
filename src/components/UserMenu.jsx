import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Divider from './Divider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { HiOutlineExternalLink } from "react-icons/hi";
import { FaBell } from "react-icons/fa";
import isAdmin from '../utils/isAdmin'

const UserMenu = ({close}) => {
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

   const handleClose = ()=>{
      if(close){
        close()
      }
   }
  return (
    <div>
        <div className='font-semibold'>My Account</div>
        <div className='text-sm flex items-center gap-2'>
          <span className='max-w-52 text-ellipsis line-clamp-1'>{user.name || user.mobile} <span className='text-medium text-red-600'>{user.role === "ADMIN" ? "(Admin)" : "" }</span></span>
          <Link onClick={handleClose} to={"/admin/profile"} className='hover:text-primary-200'>
            <HiOutlineExternalLink size={15}/>
          </Link>
        </div>

        <Divider/>

        <div className='text-sm grid gap-1'>
            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/admin/category"} className='px-2 hover:bg-orange-200 py-1'>Category</Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/admin/subcategory"} className='px-2 hover:bg-orange-200 py-1'>Sub Category</Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/admin/upload-product"} className='px-2 hover:bg-orange-200 py-1'>Upload Product</Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/admin/product"} className='px-2 hover:bg-orange-200 py-1'>Product</Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/admin/notifications"} className='px-2 hover:bg-orange-200 py-1 flex items-center gap-2'>
                  <FaBell size={14} />
                  Notification Management
                </Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/admin/banners"} className='px-2 hover:bg-orange-200 py-1'>Banner Manager</Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/admin/oms-dashboard"} className='px-2 hover:bg-orange-200 py-1'>OMS Dashboard</Link>
              )
            }

            {
              isAdmin(user.role) ? (
                <Link onClick={handleClose} to={"/admin/myorders"} className='px-2 hover:bg-orange-200 py-1'>My Orders</Link>
              ) : (
                <Link onClick={handleClose} to={"/myorders"} className='px-2 hover:bg-orange-200 py-1'>My Orders</Link>
              )
            }

            <Link onClick={handleClose} to={"/wishlist"} className='px-2 hover:bg-orange-200 py-1 flex items-center gap-2'>My Wishlist
              {wishlistCount > 0 && (
                <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">{wishlistCount}</span>
              )}
            </Link>

            <Link onClick={handleClose} to={"/admin/address"} className='px-2 hover:bg-orange-200 py-1'>Save Address</Link>

            <button onClick={handleLogout} className='text-left px-2 hover:bg-orange-200 py-1'>Log Out</button>

        </div>
    </div>
  )
}

export default UserMenu
