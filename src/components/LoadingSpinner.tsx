// LoadingSpinner.tsx
import React from 'react';
import './loadingSpinner.css';

interface LoadingSpinnerProps {
    message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading, please wait...' }) => {
    return (
        <div className="spinner-container">
        <div className="spinner"></div>
    {message && <p className="spinner-message">{message}</p>}
        </div>
    );
    };

    export default LoadingSpinner;
