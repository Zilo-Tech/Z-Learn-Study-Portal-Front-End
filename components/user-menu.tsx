import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { User, LogOut } from "lucide-react";
import { Button } from "./ui/button";

export const UserMenu = () => {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center space-x-2 text-sm font-medium text-gray-700"
      >
        <User className="h-5 w-5" />
        <span>{session.user?.name || session.user?.email}</span>
      </motion.div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => signOut()}
        className="text-gray-700 hover:text-gray-900"
      >
        <LogOut className="h-5 w-5" />
      </Button>
    </div>
  );
}; 