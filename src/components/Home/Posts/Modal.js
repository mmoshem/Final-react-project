// src/components/Modal.js
import { useEffect, useRef } from 'react';
import './Modal.css';

export default function Modal({ onClose, children }) {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };

        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEsc);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    return (
        <div className="modal-overlay">
            <div className="modal-content" ref={modalRef}>
                {children}
            </div>
        </div>
    );
}
