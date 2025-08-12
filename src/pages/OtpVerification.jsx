import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'

const OtpVerification = () => {
    const [otp, setOtp] = useState('')
    const [otpTimer, setOtpTimer] = useState(60)
    const [isResending, setIsResending] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    
    // Get mobile number and verification type from location state
    const { mobile, verificationType = 'registration' } = location.state || {}

    useEffect(() => {
        if (!mobile) {
            toast.error('Mobile number not found')
            navigate('/register')
            return
        }

        // Start timer
        const timer = setInterval(() => {
            setOtpTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [mobile, navigate])

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, '')
        if (value.length <= 6) {
            setOtp(value)
        }
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault()

        if (!otp || otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP')
            return
        }

        try {
            let response
            
            if (verificationType === 'registration') {
                response = await Axios({
                    ...SummaryApi.verifyMobileOtp,
                    data: { mobile, otp }
                })
            } else if (verificationType === 'login') {
                response = await Axios({
                    ...SummaryApi.verifyMobileLoginOtp,
                    data: { mobile, otp }
                })
            }

            if (response.data.error) {
                toast.error(response.data.message)
                return
            }

            if (response.data.success) {
                toast.success(response.data.message)
                
                if (verificationType === 'registration') {
                    navigate('/login')
                } else if (verificationType === 'login') {
                    // Handle login success
                    localStorage.setItem('accesstoken', response.data.data.accesstoken)
                    localStorage.setItem('refreshToken', response.data.data.refreshToken)
                    navigate('/')
                }
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    const handleResendOtp = async () => {
        if (isResending) return

        setIsResending(true)
        
        try {
            let response
            
            if (verificationType === 'registration') {
                response = await Axios({
                    ...SummaryApi.resendMobileOtp,
                    data: { mobile }
                })
            } else if (verificationType === 'login') {
                response = await Axios({
                    ...SummaryApi.mobileOtpLogin,
                    data: { mobile }
                })
            }

            if (response.data.error) {
                toast.error(response.data.message)
                return
            }

            if (response.data.success) {
                toast.success(response.data.message)
                setOtpTimer(60)
                setOtp('')
                
                // Restart timer
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

        } catch (error) {
            AxiosToastError(error)
        } finally {
            setIsResending(false)
        }
    }

    return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
                <div className='text-center mb-6'>
                    <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <svg className='w-8 h-8 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' />
                        </svg>
                    </div>
                    <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
                        Verify Mobile Number
                    </h2>
                    <p className='text-gray-600'>
                        We've sent a 6-digit OTP to
                    </p>
                    <p className='text-lg font-semibold text-gray-800'>
                        +91 {mobile}
                    </p>
                </div>

                <form onSubmit={handleVerifyOtp} className='space-y-6'>
                    <div>
                        <label htmlFor='otp' className='block text-sm font-medium text-gray-700 mb-2'>
                            Enter OTP
                        </label>
                        <input
                            type='text'
                            id='otp'
                            value={otp}
                            onChange={handleOtpChange}
                            maxLength={6}
                            className='w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none'
                            placeholder='000000'
                            autoFocus
                        />
                    </div>

                    <button
                        type='submit'
                        disabled={otp.length !== 6}
                        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                            otp.length === 6
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                        Verify OTP
                    </button>
                </form>

                <div className='mt-6 text-center'>
                    <p className='text-gray-600 mb-2'>Didn't receive the OTP?</p>
                    
                    {otpTimer > 0 ? (
                        <p className='text-gray-500'>
                            Resend OTP in <span className='font-semibold text-green-600'>{otpTimer}</span> seconds
                        </p>
                    ) : (
                        <button
                            onClick={handleResendOtp}
                            disabled={isResending}
                            className={`font-semibold ${
                                isResending
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-green-600 hover:text-green-700'
                            }`}
                        >
                            {isResending ? 'Sending...' : 'Resend OTP'}
                        </button>
                    )}
                </div>

                <div className='mt-6 text-center'>
                    <button
                        onClick={() => navigate(-1)}
                        className='text-gray-600 hover:text-gray-800 font-medium'
                    >
                        ← Change Mobile Number
                    </button>
                </div>
            </div>
        </section>
    )
}

export default OtpVerification