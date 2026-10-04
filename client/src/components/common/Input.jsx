const Input = ({
  label,
  name,
  type = "text",
  value = "",
  placeholder = "",
  onChange,
  onBlur,
  error = "",
  required = false,
  disabled = false,
  readOnly = false,
  autoComplete,
  className = "",
  inputClassName = "",
  ...props
}) => {
  const inputId = `input-${name}`;

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-[#031008]"
        >
          {label}

          {required && (
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      {/* Input */}
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`
          w-full
          rounded-md
          border
          bg-white
          px-4
          py-2.5
          text-sm
          text-[#031008]
          placeholder:text-gray-400
          outline-none
          transition-colors
          duration-200
          
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-gray-300 focus:border-[#33473B] focus:ring-2 focus:ring-[#33473B]/20"
          }

          disabled:cursor-not-allowed
          disabled:bg-gray-100
          disabled:text-gray-500

          read-only:bg-gray-50

          ${inputClassName}
        `}
        {...props}
      />

      {/* Error message */}
      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1.5 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;