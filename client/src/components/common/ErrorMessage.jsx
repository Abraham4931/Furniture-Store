const ErrorMessage = ({
  message = "Something went wrong. Please try again.",
  title = "Error",
  onRetry,
  showIcon = true,
  variant = "default",
  className = "",
}) => {
  const variants = {
    default: {
      container:
        "border-red-200 bg-red-50 text-red-700",
      title:
        "text-red-800",
      message:
        "text-red-600",
      button:
        "border-red-300 text-red-700 hover:bg-red-100",
    },

    warning: {
      container:
        "border-yellow-200 bg-yellow-50 text-yellow-700",
      title:
        "text-yellow-800",
      message:
        "text-yellow-700",
      button:
        "border-yellow-300 text-yellow-700 hover:bg-yellow-100",
    },

    info: {
      container:
        "border-blue-200 bg-blue-50 text-blue-700",
      title:
        "text-blue-800",
      message:
        "text-blue-700",
      button:
        "border-blue-300 text-blue-700 hover:bg-blue-100",
    },
  };

  const currentVariant =
    variants[variant] || variants.default;

  return (
    <div
      className={`
        flex
        items-start
        gap-3
        rounded-lg
        border
        p-4
        ${currentVariant.container}
        ${className}
      `}
      role="alert"
    >
      {/* Icon */}
      {showIcon && (
        <div className="flex-shrink-0 pt-0.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12V12Z"
            />
          </svg>
        </div>
      )}

      {/* Error content */}
      <div className="min-w-0 flex-1">
        {title && (
          <h3
            className={`
              text-sm
              font-semibold
              ${currentVariant.title}
            `}
          >
            {title}
          </h3>
        )}

        <p
          className={`
            mt-1
            text-sm
            leading-5
            ${currentVariant.message}
          `}
        >
          {message}
        </p>

        {/* Retry button */}
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className={`
              mt-3
              rounded-md
              border
              px-3
              py-1.5
              text-sm
              font-medium
              transition-colors
              focus:outline-none
              focus:ring-2
              focus:ring-offset-1
              ${currentVariant.button}
            `}
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;