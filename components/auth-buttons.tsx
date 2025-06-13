import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";

export const AuthButtons = ({ variant = "desktop" }) => {
  const isDesktop = variant === "desktop";
  const { data: session } = useSession();

  // Don't render anything if user is logged in
  if (session) {
    return null;
  }

  return (
    <div className="flex space-x-4">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`${
          isDesktop
            ? "flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4"
            : "flex-1 py-2 rounded-md"
        } bg-brand text-white text-sm font-bold hover:bg-brand/80 transition-colors text-center`}
      >
        <Link href="/auth/signup">Sign up</Link>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`${
          isDesktop
            ? "flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4"
            : "flex-1 py-2 rounded-md"
        } bg-[#e7edf4] text-[#0d141c] text-sm font-bold hover:bg-[#d9e0e8] transition-colors text-center`}
      >
        <Link href="/auth/signin">Log in</Link>
      </motion.div>
    </div>
  );
};