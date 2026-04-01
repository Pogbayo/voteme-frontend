import {type ReactNode } from 'react'
// import Button from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
}

const Modal = ({ isOpen, onClose, title, children, footer }: ModalProps) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/50'
        onClick={onClose}
      />

      {/* Modal */}
      <div className='relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 z-10'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b'>
          <h2 className='text-lg font-semibold text-gray-800'>{title}</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className='p-6'>{children}</div>

        {/* Footer */}
        {footer && (
          <div className='flex items-center justify-end gap-3 p-6 border-t'>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal