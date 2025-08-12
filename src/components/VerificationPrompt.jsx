import React from 'react'
import { FiAlertTriangle, FiMail, FiSmartphone, FiX } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const VerificationPrompt = ({ isOpen, onClose, verificationStatus }) => {
    const navigate = useNavigate()

    if (!isOpen) return null

    const handleGoToProfile = () => {
        onClose()
        navigate('/admin/profile')
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <FiAlertTriangle className="w-5 h-5 text-yellow-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            Verification Required
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-gray-600 mb-4">
                        To place an order, you need to verify either your email address or mobile number for security purposes.
                    </p>

                    <div className="space-y-3">
                        {verificationStatus?.email && (
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <FiMail className="w-5 h-5 text-gray-500" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">Email</p>
                                    <p className="text-xs text-gray-600">
                                        {verificationStatus.email === 'unverified' 
                                            ? 'Added but not verified' 
                                            : 'Not provided'}
                                    </p>
                                </div>
                                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                                    {verificationStatus.email === 'unverified' ? 'Unverified' : 'Missing'}
                                </span>
                            </div>
                        )}

                        {verificationStatus?.mobile && (
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <FiSmartphone className="w-5 h-5 text-gray-500" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">Mobile</p>
                                    <p className="text-xs text-gray-600">
                                        {verificationStatus.mobile === 'unverified' 
                                            ? 'Added but not verified' 
                                            : 'Not provided'}
                                    </p>
                                </div>
                                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                                    {verificationStatus.mobile === 'unverified' ? 'Unverified' : 'Missing'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleGoToProfile}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Verify Now
                    </button>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700">
                        <strong>Why verify?</strong> Verification helps us ensure order security, 
                        send important updates, and provide better customer support.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default VerificationPrompt