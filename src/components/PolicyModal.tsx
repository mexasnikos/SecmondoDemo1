import React from 'react';
// import Link from 'next/link';
import './PolicyModal.css';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  policyType: string;
  title: string;
  content: string;
}

const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose, policyType, title, content }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <div className="modal-header">
          <h2>{title}</h2>
        </div>
        <div className="modal-body">
          <p>{content}</p>
        </div>
        <div className="modal-footer">
          <a href="/quote" className="btn btn-primary" onClick={onClose}>
            Get a Quote
          </a>
          <a
            href={
              policyType === 'regular' ? '/regular-stay' : 
              policyType === 'annual' ? '/annual-multi-trip' : 
              policyType === 'comprehensive' ? '/comprehensive' :
              '/learn-more'
            }
            className="btn btn-secondary"
            onClick={onClose}
          >
            More Info
          </a>
        </div>
      </div>
    </div>
  );
};

export default PolicyModal;
