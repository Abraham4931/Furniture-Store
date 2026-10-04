import { useEffect } from "react";

const Modal = ({
  isOpen,
  onClose,
  title = "",
  children,
  footer = null,
  size = "medium",
  closeOnOverlayClick = true,
  showCloseButton = true,
}) => {
  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Don't render anything when closed
  if (!isOpen) {
    return null;
  }

  // Modal sizes
  const sizeClasses = {
    small: "max-w-sm",
    medium: "max-w-lg",
    large: "max-w-2xl",
    xlarge: "max-w-4xl",
    full: "max-w-7xl",
  };

  // Handle clicking the background
  const handleOverlayClick = (event) => {
    if (
      closeOnOverlayClick &&
      event.target === event.currentTarget
    ) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        className={`
          relative
          w-full
          ${sizeClasses[size] || sizeClasses.medium}
          max-h-[90vh]
          overflow-hidden
          rounded-xl
          bg-white
          shadow-2xl
        `}
      >
        {/* =========================
            HEADER
        ========================== */}
        {(title || showCloseButton) && (
          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-gray-200
              px-6
              py-4
            "
          >
            {title ? (
              <h2
                id="modal-title"
                className="
                  text-lg
                  font-semibold
                  text-[#031008]
                "
              >
                {title}
              </h2>
            ) : (
              <div />
            )}

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="
                  rounded-md
                  p-2
                  text-gray-500
                  transition
                  hover:bg-gray-100
                  hover:text-gray-800
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#33473B]
                  focus:ring-offset-2
                "
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* =========================
            CONTENT
        ========================== */}
        <div className="max-h-[calc(90vh-140px)] overflow-y-auto px-6 py-5">
          {children}
        </div>

        {/* =========================
            FOOTER
        ========================== */}
        {footer && (
          <div
            className="
              flex
              items-center
              justify-end
              gap-3
              border-t
              border-gray-200
              bg-gray-50
              px-6
              py-4
            "
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;