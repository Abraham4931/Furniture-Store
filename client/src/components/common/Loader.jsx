const Loader = ({
  size = "medium",
  text = "Loading...",
  fullScreen = false,
  showText = true,
  className = "",
}) => {
  const sizes = {
    small: "h-4 w-4 border-2",
    medium: "h-8 w-8 border-4",
    large: "h-12 w-12 border-4",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
    : "flex items-center justify-center";

  return (
    <div
      className={`${containerClasses} ${className}`}
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <div className="flex flex-col items-center justify-center gap-3">
        {/* Spinner */}
        <div
          className={`
            ${sizes[size] || sizes.medium}
            animate-spin
            rounded-full
            border-[#031008]
            border-t-transparent
          `}
          aria-hidden="true"
        />

        {/* Loading text */}
        {showText && (
          <p className="text-sm font-medium text-[#031008]">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default Loader;