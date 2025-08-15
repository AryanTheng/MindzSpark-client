import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegUserCircle } from "react-icons/fa";
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit';
import KycVerification from '../components/KycVerification';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { setUserDetails } from '../store/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';


const Profile = () => {
    const user = useSelector(state => state.user)
    const [openProfileAvatarEdit,setProfileAvatarEdit] = useState(false)
    const [activeTab, setActiveTab] = useState('profile') // 'profile' or 'kyc'
    const [userData,setUserData] = useState({
        name : user.name,
        email : user.email,
        mobile : user.mobile,
    })
    const [loading,setLoading] = useState(false)
    const dispatch = useDispatch()

    useEffect(()=>{
        setUserData({
            name : user.name,
            email : user.email,
            mobile : user.mobile,
        })
    },[user])

    const handleOnChange  = (e)=>{
        const { name, value} = e.target 

        setUserData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.updateUserDetails,
                data : userData
            })

            const { data : responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                const userData = await fetchUserDetails()
                dispatch(setUserDetails(userData.data))
            }

        } catch (error) {
            AxiosToastError(error)
        } finally{
            setLoading(false)
        }

    }
  return (
    <div className='p-4 max-w-4xl mx-auto'>
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'profile'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                }`}
            >
                Profile Settings
            </button>
            <button
                onClick={() => setActiveTab('kyc')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'kyc'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                }`}
            >
                KYC Verification
            </button>
        </div>

        {activeTab === 'profile' ? (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile Information</h2>
                
                {/**profile upload and display image */}
                <div className='flex items-center space-x-4 mb-6'>
                    <div className='w-20 h-20 bg-red-500 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm'>
                        {
                            user.avatar ? (
                                <img 
                                  alt={user.name}
                                  src={user.avatar}
                                  className='w-full h-full object-cover'
                                />
                            ) : (
                                <FaRegUserCircle size={65}/>
                            )
                        }
                    </div>
                    <div>
                        <button 
                            onClick={()=>setProfileAvatarEdit(true)} 
                            className='text-sm min-w-20 border border-primary-100 hover:border-primary-200 hover:bg-primary-200 px-3 py-1 rounded-full'
                        >
                            Edit Avatar
                        </button>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF (max. 2MB)</p>
                    </div>
                </div>
                
                {
                    openProfileAvatarEdit && (
                        <UserProfileAvatarEdit close={()=>setProfileAvatarEdit(false)}/>
                    )
                }

                {/**name, mobile , email, change password */}
                <form className='grid gap-6' onSubmit={handleSubmit}>
                    <div className='grid gap-2'>
                        <label className="text-sm font-medium text-gray-700">Name</label>
                        <input
                            type='text'
                            placeholder='Enter your name' 
                            className='p-3 bg-blue-50 outline-none border border-gray-200 focus:border-primary-200 focus:ring-2 focus:ring-primary-100 rounded-lg'
                            value={userData.name}
                            name='name'
                            onChange={handleOnChange}
                            required
                        />
                    </div>
                    <div className='grid gap-2'>
                        <label htmlFor='email' className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            type='email'
                            id='email'
                            placeholder='Enter your email' 
                            className='p-3 bg-blue-50 outline-none border border-gray-200 focus:border-primary-200 focus:ring-2 focus:ring-primary-100 rounded-lg'
                            value={userData.email}
                            name='email'
                            onChange={handleOnChange}
                            required
                        />
                    </div>
                    <div className='grid gap-2'>
                        <label htmlFor='mobile' className="text-sm font-medium text-gray-700">Mobile</label>
                        <input
                            type='text'
                            id='mobile'
                            placeholder='Enter your mobile' 
                            className='p-3 bg-blue-50 outline-none border border-gray-200 focus:border-primary-200 focus:ring-2 focus:ring-primary-100 rounded-lg'
                            value={userData.mobile}
                            name='mobile'
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    <button className='bg-primary-200 hover:bg-primary-100 text-white font-semibold py-3 px-6 rounded-lg transition-colors'>
                        {
                            loading ? "Updating..." : "Update Profile"
                        }
                    </button>
                </form>
            </div>
        ) : (
            <KycVerification />
        )}
    </div>
  )
}

export default Profile
