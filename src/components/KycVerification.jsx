import React, { useState, useEffect } from 'react'
import { FiMail, FiSmartphone, FiCheck, FiX, FiAlertCircle, FiPlus } from 'react-icons/fi'
import { FaRegEye } from 'react-icons/fa'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'

const KycVerification = () => {
    const [kycStatus, setKycStatus] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showAddEmail, setShowAddEmail] = useState(false)
    const [showAddMobile, setShowAddMobile] = useState(false)
    const [showOtpVerification, setShowOtpVerification] = useState(false)
    const [newEmail, setNewEmail] = useState('')
    const [newMobile, setNewMobile] = useState('')
    const [otp, setOtp] = useState('')
    const [otpTimer, setOtpTimer] = useState(0)
    const [verificationType, setVerificationType] = useState('') // 'email' or 'mobile'

    useEffect(() => {
        fetchKycStatus()
    }, [])

    const fetchKycStatus = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getKycStatus
            })

            if (response.data.success) {
                setKycStatus(response.data.data)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
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

    const handleSendEmailVerification = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.sendEmailVerification
            })

            if (response.data.success) {
                toast.success(response.data.message)
                fetchKycStatus() // Refresh status
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const handleSendMobileOtp = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.sendMobileVerificationOtp
            })

            if (response.data.success) {
                toast.success(response.data.message)
                setVerificationType('mobile')
                setShowOtpVerification(true)
                startOtpTimer()
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const handleAddEmail = async (e) => {
        e.preventDefault()
        
        if (!newEmail) {
            toast.error('Please enter an email address')
            return
        }

        try {
            const response = await Axios({
                ...SummaryApi.addEmailToAccount,
                data: { email: newEmail }
            })

            if (response.data.success) {
                toast.success(response.data.message)
                setNewEmail('')
                setShowAddEmail(false)
                fetchKycStatus()
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const handleAddMobile = async (e) => {
        e.preventDefault()
        
        if (!newMobile || newMobile.length !== 10) {
            toast.error('Please enter a valid 10-digit mobile number')
            return
        }

        try {
            const response = await Axios({
                ...SummaryApi.addMobileToAccount,
                data: { mobile: newMobile }
            })

            if (response.data.success) {
                toast.success(response.data.message)
                setNewMobile('')
                setShowAddMobile(false)
                setVerificationType('mobile')
                setShowOtpVerification(true)
                startOtpTimer()
                fetchKycStatus()
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault()

        if (!otp || otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP')
            return
        }

        try {
            const response = await Axios({
                ...SummaryApi.verifyMobileOtp,
                data: {
                    mobile: kycStatus?.mobile?.value,
                    otp: otp
                }
            })

            if (response.data.success) {
                toast.success(response.data.message)
                setOtp('')
                setShowOtpVerification(false)
                fetchKycStatus()
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const handleResendOtp = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.sendMobileVerificationOtp
            })

            if (response.data.success) {
                toast.success(response.data.message)
                startOtpTimer()
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (showOtpVerification) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiSmartphone className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Verify Mobile Number
                    </h3>
                    <p className="text-gray-600">
                        We've sent a 6-digit OTP to +91 {kycStatus?.mobile?.value}
                    </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                            Enter OTP
                        </label>
                        <input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            maxLength={6}
                            className="w-full px-4 py-3 text-center text-xl tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="000000"
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={otp.length !== 6}
                        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                            otp.length === 6
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                        Verify OTP
                    </button>
                </form>

                <div className="mt-4 text-center">
                    {otpTimer > 0 ? (
                        <p className="text-gray-500">
                            Resend OTP in <span className="font-semibold text-blue-600">{otpTimer}</span> seconds
                        </p>
                    ) : (
                        <button
                            onClick={handleResendOtp}
                            className="text-blue-600 hover:text-blue-700 font-semibold"
                        >
                            Resend OTP
                        </button>
                    )}
                </div>

                <div className="mt-4 text-center">
                    <button
                        onClick={() => setShowOtpVerification(false)}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        ← Back
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">KYC Verification</h2>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    kycStatus?.overallStatus === 'verified' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                }`}>
                    {kycStatus?.overallStatus === 'verified' ? 'Verified' : 'Pending Verification'}
                </div>
            </div>

            <div className="space-y-4">
                {/* Email Verification */}
                <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                kycStatus?.email?.verified 
                                    ? 'bg-green-100' 
                                    : kycStatus?.email?.provided 
                                        ? 'bg-yellow-100' 
                                        : 'bg-gray-100'
                            }`}>
                                <FiMail className={`w-5 h-5 ${
                                    kycStatus?.email?.verified 
                                        ? 'text-green-600' 
                                        : kycStatus?.email?.provided 
                                            ? 'text-yellow-600' 
                                            : 'text-gray-400'
                                }`} />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-800">Email Verification</h3>
                                <p className="text-sm text-gray-600">
                                    {kycStatus?.email?.provided 
                                        ? kycStatus.email.value 
                                        : 'No email address added'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            {kycStatus?.email?.verified ? (
                                <div className="flex items-center space-x-1 text-green-600">
                                    <FiCheck className="w-4 h-4" />
                                    <span className="text-sm font-medium">Verified</span>
                                </div>
                            ) : kycStatus?.email?.provided ? (
                                <button
                                    onClick={handleSendEmailVerification}
                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Verify Now
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowAddEmail(true)}
                                    className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
                                >
                                    <FiPlus className="w-3 h-3" />
                                    <span>Add Email</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Verification */}
                <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                kycStatus?.mobile?.verified 
                                    ? 'bg-green-100' 
                                    : kycStatus?.mobile?.provided 
                                        ? 'bg-yellow-100' 
                                        : 'bg-gray-100'
                            }`}>
                                <FiSmartphone className={`w-5 h-5 ${
                                    kycStatus?.mobile?.verified 
                                        ? 'text-green-600' 
                                        : kycStatus?.mobile?.provided 
                                            ? 'text-yellow-600' 
                                            : 'text-gray-400'
                                }`} />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-800">Mobile Verification</h3>
                                <p className="text-sm text-gray-600">
                                    {kycStatus?.mobile?.provided 
                                        ? `+91 ${kycStatus.mobile.value}` 
                                        : 'No mobile number added'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            {kycStatus?.mobile?.verified ? (
                                <div className="flex items-center space-x-1 text-green-600">
                                    <FiCheck className="w-4 h-4" />
                                    <span className="text-sm font-medium">Verified</span>
                                </div>
                            ) : kycStatus?.mobile?.provided ? (
                                <button
                                    onClick={handleSendMobileOtp}
                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Verify Now
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowAddMobile(true)}
                                    className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
                                >
                                    <FiPlus className="w-3 h-3" />
                                    <span>Add Mobile</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Verification Benefits */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-3">
                    <FiAlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <h4 className="font-medium text-blue-800 mb-1">Why verify your account?</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Required for placing orders</li>
                            <li>• Enhanced account security</li>
                            <li>• Faster customer support</li>
                            <li>• Order updates and notifications</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Add Email Modal */}
            {showAddEmail && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Email Address</h3>
                        <form onSubmit={handleAddEmail} className="space-y-4">
                            <div>
                                <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="newEmail"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="Enter your email address"
                                    required
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddEmail(false)
                                        setNewEmail('')
                                    }}
                                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Add Email
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Mobile Modal */}
            {showAddMobile && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Mobile Number</h3>
                        <form onSubmit={handleAddMobile} className="space-y-4">
                            <div>
                                <label htmlFor="newMobile" className="block text-sm font-medium text-gray-700 mb-1">
                                    Mobile Number
                                </label>
                                <div className="flex">
                                    <span className="bg-gray-100 border border-r-0 rounded-l px-3 py-2 text-gray-600">
                                        +91
                                    </span>
                                    <input
                                        type="tel"
                                        id="newMobile"
                                        value={newMobile}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '')
                                            if (value.length <= 10) {
                                                setNewMobile(value)
                                            }
                                        }}
                                        className="flex-1 px-3 py-2 border rounded-r focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        placeholder="Enter 10-digit mobile number"
                                        maxLength={10}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddMobile(false)
                                        setNewMobile('')
                                    }}
                                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Add Mobile
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default KycVerification