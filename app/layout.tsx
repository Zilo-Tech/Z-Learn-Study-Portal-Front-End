import "@/app/globals.css";



import { ReactNode } from "react";

export default function COurseLayout({ children }: { children: ReactNode }) {
  return (
      <html
        
      >
        <body>
        {children}
        </body>
      </html>
  );
}
