import React from 'react';

const Input = ({ label, error, icon, className = '', ...props }) => {
  return (
    <div className="mb-3 sm:mb-4">
      {label && <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">{icon}</div>}
        <input
          className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${icon ? 'pl-7 sm:pl-10' : ''} ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default Input;