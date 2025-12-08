import React from "react";

const Badge = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  // Tailwind classes for each variant
  const variantClasses = {
    default: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
    secondary: "border-transparent bg-gray-200 text-gray-800 hover:bg-gray-300",
    destructive: "border-transparent bg-red-500 text-white hover:bg-red-600",
    outline: "border border-gray-300 text-gray-800 hover:bg-gray-100",
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
