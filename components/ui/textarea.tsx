import * as React from "react";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={"w-full border rounded px-3 py-2 focus:outline-none focus:ring " + (className || "")}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
