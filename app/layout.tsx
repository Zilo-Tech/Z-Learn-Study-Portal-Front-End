import "@/app/globals.css";
import { ReactNode } from "react";
import Header from "../components/global/Header";

export default function COurseLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
