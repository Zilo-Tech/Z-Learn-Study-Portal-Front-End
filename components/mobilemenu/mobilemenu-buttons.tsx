"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { AuthButtons } from '../auth-buttons';
import { NavigationItem } from '@/types/navigation';

// Mobile Menu Component
export const MobileMenu = ({ isOpen, items = [] }: { isOpen: boolean; items?: NavigationItem[] }) => {
    const menuVariants = {
        hidden: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        },
        visible: {
            opacity: 1,
            height: "auto",
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    const menuItemVariants = {
        hidden: {
            opacity: 0,
            y: -10,
            transition: {
                duration: 0.2
            }
        },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.2,
                ease: "easeOut"
            }
        })
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="md:hidden overflow-hidden"
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    <div className="px-4 pt-2 pb-4 space-y-1 sm:px-6 bg-white">
                        {items.map((item, index) => (
                            <motion.a
                                key={item.name}
                                href={item.href}
                                className="block px-3 py-2 rounded-md text-base font-medium text-[#0d141c] hover:bg-gray-50"
                                variants={menuItemVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                custom={index}
                                whileHover={{ x: 5 }}
                            >
                                {item.name}
                            </motion.a>
                        ))}
                        <motion.div
                            variants={menuItemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            custom={items.length}
                        >
                            <AuthButtons variant="mobile" />
                        </motion.div>
                    </div>
                    
                </motion.div>
            )}
        </AnimatePresence>
    );
};