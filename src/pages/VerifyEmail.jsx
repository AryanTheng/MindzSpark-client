import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { FiMail, FiCheck, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'

const VerifyEmail = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [verificationStatus, setVerificationStatus] = useState('loading') // 'loading', 'success', 'error'
    const [message, setMessage] = useState('')

    useEffect(() => {
        const code = searchParams.get('code')
        
        if (!code) {
            setVerificationStatus('error')
            setMessage('Invalid verification link')
            return
        }

        verifyEmail(code)
    }, [searchParams])

    const verifyEmail = async (code) => {
        try {
            const response = await Axios({
                ...SummaryApi.verifyEmail,
                data: { code }
            })

            if (response.data.success) {
                setVerificationStatus('success')
                setMessage('Email verified successfully!')
                toast.success('Email verified successfully!')
                
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login')
                }, 3000)
            } else {
                setVerificationStatus('error')
                setMessage(response.data.message || 'Verification failed')
                toast.error(response.data.message || 'Verification failed')
            }
        } catch (error) {
            setVerificationStatus('error')
            setMessage('Verification failed. Please try again.')
            AxiosToastError(error)
        }
    }

    return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
                <div className='text-center mb-6'>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                        verificationStatus === 'loading' 
                            ? 'bg-blue-100' 
                            : verificationStatus === 'success' 
                                ? 'bg-green-100' 
                                : 'bg-red-100'
                    }`}>
                        {verificationStatus === 'loading' && (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        )}
                        {verificationStatus === 'success' && (
                            <FiCheck className="w-8 h-8 text-green-600" />
                        )}
                        {verificationStatus === 'error' && (
                            <FiX className="w-8 h-8 text-red-600" />
                        )}
                    </div>
                    
                    <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
                        {verificationStatus === 'loading' && 'Verifying Email...'}
                        {verificationStatus === 'success' && 'Email Verified!'}
                        {verificationStatus === 'error' && 'Verification Failed'}
                    </h2>
                    
                    <p className='text-gray-600'>
                        {message}
                    </p>
                </div>

                {verificationStatus === 'success' && (
                    <div className="space-y-4">
                        <div className="p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <FiMail className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="text-sm font-medium text-green-800">
                                        Your email has been successfully verified!
                                    </p>
                                    <p className="text-xs text-green-600 mt-1">
                                        You can now enjoy all features of your account.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-4">
                                Redirecting to login page in 3 seconds...
                            </p>
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Go to Login
                            </button>
                        </div>
                    </div>
                )}

                {verificationStatus === 'error' && (
                    <div className="space-y-4">
                        <div className="p-4 bg-red-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <FiX className="w-5 h-5 text-red-600" />
                                <div>
                                    <p className="text-sm font-medium text-red-800">
                                        Email verification failed
                                    </p>
                                    <p className="text-xs text-red-600 mt-1">
                                        The verification link may be invalid or expired.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-center space-y-3">
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Go to Login
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="w-full text-blue-600 hover:text-blue-700 text-sm"
                            >
                                Need to register again?
                            </button>
                        </div>
                    </div>
                )}

                {verificationStatus === 'loading' && (
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Please wait while we verify your email address...
                        </p>
                    </div>
                )}
            </div>
        </section>
    )
}

export default VerifyEmail