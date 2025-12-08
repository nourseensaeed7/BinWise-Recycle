import React from "react";

const Card = ({
  title,
  description,
  content,
  footer,
  action,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`bg-white text-black flex flex-col gap-4 rounded-xl border shadow-md ${className}`}
      {...props}
    >
      {/* Header */}
      {(title || description || action) && (
        <div className="flex justify-between items-start px-6 pt-6">
          <div>
            {title && <h4 className="text-lg font-semibold">{title}</h4>}
            {description && <p className="text-gray-500 text-sm mt-1">{description}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}

      {/* Content */}
      {content && <div className="px-6 py-4">{content}</div>}

      {/* Footer */}
      {footer && <div className="flex items-center justify-end px-6 py-4 border-t">{footer}</div>}
    </div>
  );
};

export default Card;
