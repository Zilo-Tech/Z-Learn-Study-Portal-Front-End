// Mobile Menu Button Component
import { motion } from 'framer-motion';

export const MobileMenuButton: React.FC<{ isMenuOpen: boolean; onToggle: () => void }> = ({ isMenuOpen, onToggle }) => (
    <div className="md:hidden flex items-center">
      <motion.button
        onClick={onToggle}
        className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none"
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <motion.svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ rotate: isMenuOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </motion.svg>
      </motion.button>
    </div>
  );
  