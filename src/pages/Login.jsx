import React, { useState } from 'react'
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { FiSmartphone, FiMail, FiLock } from "react-icons/fi";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const Login = () => {
    const [loginType, setLoginType] = useState('email') // 'email' or 'mobile'
    const [loginMethod, setLoginMethod] = useState('password') // 'password' or 'otp'
    const [data, setData] = useState({
        email: "",
        mobile: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showOtpVerification, setShowOtpVerification] = useState(false)
    const [otp, setOtp] = useState('')
    const [otpTimer, setOtpTimer] = useState(0)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const validateMobile = (mobile) => {
        const mobileRegex = /^[6-9]\d{9}$/
        return mobileRegex.test(mobile)
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const valideValue = () => {
        if (loginMethod === 'otp') {
            return loginType === 'mobile' ? data.mobile : false
        } else {
            if (loginType === 'email') {
                return data.email && data.password
            } else {
                return data.mobile && data.password
            }
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault()

        if (loginType === 'email' && !validateEmail(data.email)) {
            toast.error("Please enter a valid email address")
            return
        }

        if (loginType === 'mobile' && !validateMobile(data.mobile)) {
            toast.error("Please enter a valid 10-digit mobile number")
            return
        }

        try {
            if (loginMethod === 'otp' && loginType === 'mobile') {
                // Send OTP for mobile login
                const response = await Axios({
                    ...SummaryApi.mobileOtpLogin,
                    data: { mobile: data.mobile }
                })

                if (response.data.error) {
                    toast.error(response.data.message)
                }

                if (response.data.success) {
                    toast.success(response.data.message)
                    setShowOtpVerification(true)
                    startOtpTimer()
                }
            } else {
                // Regular password login
                const payload = {
                    password: data.password,
                    loginType: loginType
                }

                if (loginType === 'email') {
                    payload.email = data.email
                } else {
                    payload.mobile = data.mobile
                }

                const response = await Axios({
                    ...SummaryApi.login,
                    data: payload
                })
                
                if (response.data.error) {
                    toast.error(response.data.message)
                }

                if (response.data.success) {
                    toast.success(response.data.message)
                    localStorage.setItem('accesstoken', response.data.data.accesstoken)
                    localStorage.setItem('refreshToken', response.data.data.refreshToken)

                    const userDetails = await fetchUserDetails()
                    dispatch(setUserDetails(userDetails.data))

                    setData({
                        email: "",
                        mobile: "",
                        password: "",
                    })
                    navigate("/")
                }
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    const startOtpTimer = () => {
        setOtpTimer(60)
        const timer = setInterval(() => {
            setOtpTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }

    const handleOtpVerification = async(e) => {
        e.preventDefault()

        if (!otp || otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP")
            return
        }

        try {
            const response = await Axios({
                ...SummaryApi.verifyMobileLoginOtp,
                data: {
                    mobile: data.mobile,
                    otp: otp
                }
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                localStorage.setItem('accesstoken', response.data.data.accesstoken)
                localStorage.setItem('refreshToken', response.data.data.refreshToken)

                const userDetails = await fetchUserDetails()
                dispatch(setUserDetails(userDetails.data))

                setData({
                    email: "",
                    mobile: "",
                    password: "",
                })
                setOtp('')
                setShowOtpVerification(false)
                navigate("/")
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    const handleResendOtp = async() => {
        try {
            const response = await Axios({
                ...SummaryApi.mobileOtpLogin,
                data: { mobile: data.mobile }
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                startOtpTimer()
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    if (showOtpVerification) {
        return (
            <section className='w-full container mx-auto px-2'>
                <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
                    <div className='text-center mb-6'>
                        <h2 className='text-2xl font-semibold text-gray-800'>Verify Mobile Number</h2>
                        <p className='text-gray-600 mt-2'>
                            We've sent a 6-digit OTP to +91 {data.mobile}
                        </p>
                    </div>

                    <form className='grid gap-4' onSubmit={handleOtpVerification}>
                        <div className='grid gap-1'>
                            <label htmlFor='otp'>Enter OTP:</label>
                            <input
                                type='text'
                                id='otp'
                                maxLength={6}
                                className='bg-blue-50 p-3 border rounded outline-none focus:border-primary-200 text-center text-lg tracking-widest'
                                name='otp'
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                placeholder='000000'
                                autoFocus
                            />
                        </div>

                        <button 
                            disabled={!otp || otp.length !== 6} 
                            className={`${otp && otp.length === 6 ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} text-white py-3 rounded font-semibold my-3 tracking-wide`}
                        >
                            Login
                        </button>

                        <div className='text-center'>
                            {otpTimer > 0 ? (
                                <p className='text-gray-600'>
                                    Resend OTP in {otpTimer} seconds
                                </p>
                            ) : (
                                <button
                                    type='button'
                                    onClick={handleResendOtp}
                                    className='text-green-700 hover:text-green-800 font-semibold'
                                >
                                    Resend OTP
                                </button>
                            )}
                        </div>
                    </form>

                    <div className='text-center mt-4'>
                        <button
                            onClick={() => {
                                setShowOtpVerification(false)
                                setOtp('')
                            }}
                            className='text-gray-600 hover:text-gray-800'
                        >
                            ← Back to Login
                        </button>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
                <div className='text-center mb-6'>
                    <h2 className='text-2xl font-semibold text-gray-800'>Welcome Back</h2>
                    <p className='text-gray-600'>Login to your account</p>
                </div>

                {/* Login Type Selector */}
                <div className='flex bg-gray-100 rounded-lg p-1 mb-4'>
                    <button
                        type='button'
                        onClick={() => {
                            setLoginType('email')
                            setLoginMethod('password')
                        }}
                        className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all ${
                            loginType === 'email' 
                                ? 'bg-white text-green-700 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        <FiMail size={18} />
                        <span>Email</span>
                    </button>
                    <button
                        type='button'
                        onClick={() => setLoginType('mobile')}
                        className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all ${
                            loginType === 'mobile' 
                                ? 'bg-white text-green-700 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        <FiSmartphone size={18} />
                        <span>Mobile</span>
                    </button>
                </div>

                {/* Login Method Selector for Mobile */}
                {loginType === 'mobile' && (
                    <div className='flex bg-gray-50 rounded-lg p-1 mb-4'>
                        <button
                            type='button'
                            onClick={() => setLoginMethod('password')}
                            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-all text-sm ${
                                loginMethod === 'password' 
                                    ? 'bg-white text-green-700 shadow-sm' 
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            <FiLock size={16} />
                            <span>Password</span>
                        </button>
                        <button
                            type='button'
                            onClick={() => setLoginMethod('otp')}
                            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-all text-sm ${
                                loginMethod === 'otp' 
                                    ? 'bg-white text-green-700 shadow-sm' 
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            <FiSmartphone size={16} />
                            <span>OTP</span>
                        </button>
                    </div>
                )}

                <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
                    {loginType === 'email' ? (
                        <div className='grid gap-1'>
                            <label htmlFor='email'>Email:</label>
                            <input
                                type='email'
                                id='email'
                                className='bg-blue-50 p-2 border rounded outline-none focus:border-primary-200'
                                name='email'
                                value={data.email}
                                onChange={handleChange}
                                placeholder='Enter your email'
                            />
                        </div>
                    ) : (
                        <div className='grid gap-1'>
                            <label htmlFor='mobile'>Mobile Number:</label>
                            <div className='flex'>
                                <span className='bg-gray-100 border border-r-0 rounded-l px-3 py-2 text-gray-600'>
                                    +91
                                </span>
                                <input
                                    type='tel'
                                    id='mobile'
                                    maxLength={10}
                                    className='bg-blue-50 p-2 border rounded-r outline-none focus:border-primary-200 flex-1'
                                    name='mobile'
                                    value={data.mobile}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '')
                                        setData(prev => ({ ...prev, mobile: value }))
                                    }}
                                    placeholder='Enter 10-digit mobile number'
                                />
                            </div>
                        </div>
                    )}

                    {loginMethod === 'password' && (
                        <div className='grid gap-1'>
                            <label htmlFor='password'>Password:</label>
                            <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id='password'
                                    className='w-full outline-none'
                                    name='password'
                                    value={data.password}
                                    onChange={handleChange}
                                    placeholder='Enter your password'
                                />
                                <div onClick={() => setShowPassword(prev => !prev)} className='cursor-pointer'>
                                    {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                </div>
                            </div>
                            <Link to={"/forgot-password"} className='block ml-auto hover:text-primary-200 text-sm mt-1'>
                                Forgot password?
                            </Link>
                        </div>
                    )}

                    <button 
                        disabled={!valideValue()} 
                        className={`${valideValue() ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} text-white py-2 rounded font-semibold my-3 tracking-wide`}
                    >
                        {loginMethod === 'otp' ? 'Send OTP' : 'Login'}
                    </button>
                </form>

                <p className='text-center'>
                    Don't have account? <Link to={"/register"} className='font-semibold text-green-700 hover:text-green-800'>Register</Link>
                </p>
            </div>
        </section>
    )
}

export default Login