const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className = "",
  ...props
}) => {
  const variants = {
    primary:
      "bg-[#031008] text-white hover:bg-[#33473B] focus:ring-[#33473B]",

    secondary:
      "bg-[#F8F5EF] text-[#031008] border border-[#031008] hover:bg-[#e9e5dc] focus:ring-[#33473B]",

    outline:
      "bg-transparent text-[#031008] border border-[#031008] hover:bg-[#F8F5EF] focus:ring-[#33473B]",

    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",

    ghost:
      "bg-transparent text-[#031008] hover:bg-[#F8F5EF] focus:ring-[#33473B]",
  };

  const sizes = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base",
  };

  const baseStyles = `
    inline-flex
    items-center
    justify-center
    gap-2
    rounded-md
    font-medium
    transition-all
    duration-200
    focus:outline-none
    focus:ring-2
    focus:ring-offset-2
    disabled:cursor-not-allowed
    disabled:opacity-50
  `;

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.medium}
        ${widthStyle}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />

          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;