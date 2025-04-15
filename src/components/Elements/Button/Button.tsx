import { ButtonHTMLAttributes, forwardRef } from "react"; // forwardRef をインポート

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "text";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

// forwardRef を使用して ref を受け取れるようにする
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      type = "button",
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    // ref を引数に追加
    const baseStyles =
      "inline-flex items-center justify-center font-medium focus:outline-none";

    const sizeStyles = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2",
      lg: "px-6 py-3 text-lg",
    };

    const variantStyles = {
      primary: "bg-blue-600 hover:bg-blue-700 text-white",
      secondary: "bg-purple-500 hover:bg-purple-600 text-white",
      danger: "bg-red-600 hover:bg-red-700 text-white",
      text: "text-blue-600 hover:text-blue-700 underline",
    };

    const disabledStyles =
      disabled || isLoading ? "opacity-50 cursor-not-allowed" : "";

    const buttonStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyles} ${className}`;

    return (
      <button
        ref={ref} // ref を button 要素に渡す
        type={type}
        className={buttonStyles}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

// displayName を設定 (デバッグ用)
Button.displayName = "Button";
