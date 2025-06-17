import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { sanitizeInput } from '../../utils/security';

interface SecureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
  sanitize?: boolean;
  maxLength?: number;
  onSecureChange?: (value: string) => void;
}

const SecureInput: React.FC<SecureInputProps> = ({
  label,
  error,
  icon,
  showPasswordToggle = false,
  sanitize = true,
  maxLength = 255,
  onSecureChange,
  className = '',
  type = 'text',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const inputType = showPasswordToggle && type === 'password' 
    ? (showPassword ? 'text' : 'password') 
    : type;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Enforce max length
    if (value.length > maxLength) {
      value = value.slice(0, maxLength);
    }
    
    // Sanitize input if enabled
    if (sanitize && type !== 'password') {
      value = sanitizeInput(value);
    }
    
    setCharCount(value.length);
    
    // Update the input value
    if (inputRef.current) {
      inputRef.current.value = value;
    }
    
    // Call the secure change handler
    if (onSecureChange) {
      onSecureChange(value);
    }
    
    // Call the original onChange if provided
    if (props.onChange) {
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value }
      };
      props.onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    // Prevent pasting potentially malicious content
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text/plain');
    const sanitizedText = sanitize ? sanitizeInput(pastedText) : pastedText;
    const truncatedText = sanitizedText.slice(0, maxLength);
    
    if (inputRef.current) {
      inputRef.current.value = truncatedText;
      setCharCount(truncatedText.length);
      
      if (onSecureChange) {
        onSecureChange(truncatedText);
      }
    }
  };

  useEffect(() => {
    // Set initial character count
    if (inputRef.current && inputRef.current.value) {
      setCharCount(inputRef.current.value.length);
    }
  }, []);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {props.required && <span className="text-red-400 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          ref={inputRef}
          type={inputType}
          className={`
            w-full px-4 py-3 bg-dark-700 border rounded-lg text-white placeholder-gray-400 
            transition-all duration-200 focus:outline-none
            ${icon ? 'pl-10' : ''}
            ${showPasswordToggle ? 'pr-12' : ''}
            ${error 
              ? 'border-red-500 focus:border-red-400' 
              : isFocused 
                ? 'border-primary-500 focus:border-primary-400' 
                : 'border-gray-600 hover:border-gray-500'
            }
            ${className}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          onPaste={handlePaste}
          maxLength={maxLength}
          autoComplete={type === 'password' ? 'current-password' : 'off'}
          spellCheck={false}
          {...props}
        />
        
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      
      {/* Character count and error display */}
      <div className="flex justify-between items-center text-xs">
        <div>
          {error && (
            <div className="flex items-center space-x-1 text-red-400">
              <AlertTriangle className="h-3 w-3" />
              <span>{error}</span>
            </div>
          )}
        </div>
        <div className="text-gray-500">
          {charCount}/{maxLength}
        </div>
      </div>
    </div>
  );
};

export default SecureInput;