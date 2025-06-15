import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { LogIn, UserPlus } from "lucide-react";

export const AuthButtons = ({ variant = "desktop" }) => {
  const isDesktop = variant === "desktop";
  const { data: session } = useSession();

  // Don&apos;t render anything if user is logged in
  if (session) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      {/* Sign In Button */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link 
          href="/auth/signin"
          className={`${
            isDesktop
              ? "flex items-center gap-2 px-4 py-2 rounded-lg"
              : "flex items-center gap-2 px-4 py-2 rounded-lg"
          } text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 font-medium border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md`}
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In</span>
        </Link>
      </motion.div>

      {/* Sign Up Button */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link 
          href="/auth/signup"
          className={`${
            isDesktop
              ? "flex items-center gap-2 px-4 py-2 rounded-lg"
              : "flex items-center gap-2 px-4 py-2 rounded-lg"
          } bg-gradient-to-r from-[#446d6d] to-[#002424] text-white hover:from-[#446d6d]/80 hover:to-[#002424]/80 transition-all duration-200 font-semibold shadow-sm hover:shadow-md`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Sign Up</span>
        </Link>
      </motion.div>
    </div>
  );
};