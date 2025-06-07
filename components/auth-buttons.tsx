import { motion } from "framer-motion";
export const AuthButtons = ({ variant = "desktop" }) => {
  const isDesktop = variant === "desktop";
  
  return (
    <div className={`flex gap-2 ${isDesktop ? 'ml-4' : 'pt-2'}`}>
      <motion.button
        className={`${
          isDesktop 
            ? 'flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4' 
            : 'flex-1 py-2 rounded-md'
        } bg-[#0c77f2] text-white text-sm font-bold hover:bg-[#0a66d4] transition-colors`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Sign up
      </motion.button>
      <motion.button
        className={`${
          isDesktop 
            ? 'flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4' 
            : 'flex-1 py-2 rounded-md'
        } bg-[#e7edf4] text-[#0d141c] text-sm font-bold hover:bg-[#d9e0e8] transition-colors`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Log in
      </motion.button>
    </div>
  );
};