import React from 'react'
import { IoClose } from "react-icons/io5";

const CofirmBox = ({ close, cancel, confirm, errorMessage, onLogin, onRegister }) => {
  const isAuthError = errorMessage && errorMessage.toLowerCase().includes('provide token');
  return (
    <div className='fixed top-0 bottom-0 right-0 left-0 z-50 bg-neutral-800 bg-opacity-70 p-4 flex justify-center items-center'>
      <div className='bg-white w-full max-w-md p-4 rounded'>
        <div className='flex justify-between items-center gap-3'>
          <h1 className='font-semibold'>{errorMessage ? 'Error' : 'Confirm Action'}</h1>
          <button onClick={close}>
            <IoClose size={25} />
          </button>
        </div>
        <p className='my-4'>
          {errorMessage
            ? <span className='text-red-600'>{errorMessage === 'Provide token' ? 'You need to login or register to continue.' : errorMessage}</span>
            : 'Are you sure you want to proceed?'}
        </p>
        <div className='w-fit ml-auto flex items-center gap-3'>
          {isAuthError && (
            <>
              <button onClick={onLogin} className='px-4 py-1 border rounded border-green-600 text-green-600 hover:bg-green-600 hover:text-white'>Login</button>
              <button onClick={onRegister} className='px-4 py-1 border rounded border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'>Register</button>
            </>
          )}
          {!errorMessage && <button onClick={cancel} className='px-4 py-1 border rounded border-gray-400 text-gray-600 hover:bg-gray-200'>Cancel</button>}
          {!errorMessage && <button onClick={confirm} className='px-4 py-1 border rounded border-red-600 text-red-600 hover:bg-red-600 hover:text-white'>Confirm</button>}
        </div>
      </div>
    </div>
  )
}

export default CofirmBox
