import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../utils/cn';

interface IngredientInputProps {
  onConfirm: (value: string) => void;
  checkSubstitute?: (value: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export default function IngredientInput({
  onConfirm,
  checkSubstitute,
  disabled = false,
  placeholder = "Enter ingredient name...",
  className
}: IngredientInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setError(null);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only check substitutes if the function is provided and value is not empty
    if (checkSubstitute && newValue.trim()) {
      console.log('🔍 Preparing to check substitute for:', newValue);
      setIsChecking(true);

      timeoutRef.current = setTimeout(async () => {
        try {
          await checkSubstitute(newValue);
          console.log('✅ Substitute check completed for:', newValue);
        } catch (err) {
          console.error('❌ Error checking substitute:', err);
          setError('Failed to check for substitutes. Please try again.');
        } finally {
          setIsChecking(false);
        }
      }, 500); // 500ms debounce
    }
  };

  const handleConfirm = () => {
    if (inputValue.trim()) {
      console.log('✨ Confirming ingredient:', inputValue);
      onConfirm(inputValue.trim());
      setInputValue(""); // Clear input after confirmation
      setError(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleConfirm();
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            placeholder={placeholder}
            aria-invalid={!!error}
            aria-describedby={error ? 'ingredient-error' : undefined}
            className={cn(
              'w-full px-3 py-2 rounded-md border transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              {
                'border-gray-300 hover:border-gray-400': !error,
                'border-red-300 hover:border-red-400 focus:ring-red-500': error,
                'bg-gray-50 cursor-not-allowed': disabled,
                'pr-10': isChecking
              },
              className
            )}
          />
          {isChecking && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        <button
          onClick={handleConfirm}
          disabled={disabled || !inputValue.trim() || isChecking}
          className={cn(
            'px-4 py-2 rounded-md font-medium transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            {
              'bg-blue-500 hover:bg-blue-600 text-white': !disabled && inputValue.trim() && !isChecking,
              'bg-gray-200 text-gray-400 cursor-not-allowed': disabled || !inputValue.trim() || isChecking
            }
          )}
        >
          Add
        </button>
      </div>
      {error && (
        <p
          id="ingredient-error"
          className="mt-1 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
} 