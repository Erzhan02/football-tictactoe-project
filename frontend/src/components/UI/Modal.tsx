import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Prevent scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-md animate-slide-up">
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1a2f1d 0%, #0d2910 100%)',
            border: '1px solid rgba(251,191,36,0.3)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(251,191,36,0.1)',
          }}
        >
          {title && (
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
            >
              <h2 className="text-lg font-bold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="text-white/50 hover:text-white transition-colors text-xl leading-none"
              >
                ✕
              </button>
            </div>
          )}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
