import "@/app/globals.css";
import Header from "@/components/ui/header";
import { ReactNode } from "react";

export default function COurseLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}
