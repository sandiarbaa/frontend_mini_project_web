"use client";

import React, { FC } from "react";

interface InputProps {
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  disabled?: boolean;
  required?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string; // Optional hint text
}

const Input: FC<InputProps> = ({
  type = "text",
  id,
  name,
  placeholder,
  value,
  defaultValue,
  onChange,
  onBlur,
  className = "",
  min,
  max,
  step,
  disabled = false,
  success = false,
  error = false,
  hint,
}) => {
  const isDate = type === "date";

  let inputClasses = `h-11 w-full rounded-lg border text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 px-4 ${className}`;

  if (!isDate) inputClasses += " appearance-none"; // jangan pakai appearance-none untuk date
  if (isDate) inputClasses += " cursor-pointer";

  if (disabled) {
    inputClasses +=
      " text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
  } else if (error) {
    inputClasses +=
      " text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10 dark:text-error-400 dark:border-error-500";
  } else if (success) {
    inputClasses +=
      " text-success-500 border-success-400 focus:ring-success-500/10 focus:border-success-300 dark:text-success-400 dark:border-success-500";
  } else {
    inputClasses +=
      " bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800";
  }

  return (
    <div>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onBlur={onBlur}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={inputClasses}
      />
      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error ? "text-error-500" : success ? "text-success-500" : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;
