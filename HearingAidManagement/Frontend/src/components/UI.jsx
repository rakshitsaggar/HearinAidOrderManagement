import React from 'react';

// Loading Spinner
export const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }[size];

  return (
    <div className={`${sizeClass} animate-spin rounded-full border-2 border-gray-300 border-t-primary-500`} />
  );
};

// Button Component
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  onClick,
  type = 'button',
  className = ''
}) => {
  const baseClass = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClass} ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {loading && <LoadingSpinner size="sm" />}
      {!loading && children}
    </button>
  );
};

// Card Component
export const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
);

// Input Component
export const Input = ({ 
  label, 
  error, 
  help,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  className = ''
}) => (
  <div className={className}>
    {label && (
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-500 dark:text-white ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    {help && !error && <p className="mt-1 text-sm text-gray-500">{help}</p>}
  </div>
);

// Select Component
export const Select = ({ 
  label, 
  error,
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  required = false,
  className = ''
}) => (
  <div className={className}>
    {label && (
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <select
      value={value}
      onChange={onChange}
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

// Table Component
export const Table = ({ columns, data, className = '' }) => (
  <div className={`overflow-x-auto ${className}`}>
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          {columns.map((column, index) => (
            <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700">
            {columns.map((column, colIndex) => (
              <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {typeof column.accessor === 'function' ? column.accessor(row, rowIndex) : row[column.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Badge Component
export const Badge = ({ children, color = 'gray', className = '' }) => {
  const colors = {
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};

// Alert Component
export const Alert = ({ type = 'info', title, children, className = '' }) => {
  const types = {
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900 dark:border-blue-800 dark:text-blue-200',
    success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900 dark:border-green-800 dark:text-green-200',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-800 dark:text-yellow-200',
    error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900 dark:border-red-800 dark:text-red-200'
  };

  return (
    <div className={`border-l-4 p-4 ${types[type]} ${className}`}>
      {title && <h3 className="font-medium mb-2">{title}</h3>}
      <div>{children}</div>
    </div>
  );
};