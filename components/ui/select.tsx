import * as React from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, className, ...props }, ref) => (
    <select
      ref={ref}
      className={"w-full border rounded px-3 py-2 focus:outline-none focus:ring " + (className || "")}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

export const SelectTrigger = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>{children}</div>
);
export const SelectValue = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
export const SelectContent = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
export const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => (
  <option value={value}>{children}</option>
);
