// NavigationLinks.tsx
import { usePathname } from 'next/navigation';
import { NavigationItem } from '@/types/navigation';

interface NavigationLinksProps {
  items: NavigationItem[];
  className?: string;
}

// Helper function to check if a link is active
const isLinkActive = (href: string, pathname: string): boolean => {
  // Exact match for home page
  if (href === '/' && pathname === '/') {
    return true;
  }
  
  // For other pages, check if pathname starts with href (excluding home)
  if (href !== '/' && pathname.startsWith(href)) {
    return true;
  }
  
  return false;
};

// Navigation Links Component
export const NavigationLinks = ({ items = [], className = "" }: NavigationLinksProps) => {
  const pathname = usePathname();
  
  return (
    <div className={`flex items-center gap-4 lg:gap-9 ${className}`}>
      {items.map((item) => {
        const isActive = isLinkActive(item.href, pathname);
        
        return (
          <a
            key={item.name}
            className={`text-sm leading-normal font-semibold transition-colors duration-200 ${
              isActive
                ? "text-brand border-b-2 border-brand pb-1"
                : "text-[#0d141c] hover:text-brand"
            }`}
            href={item.href}
          >
            {item.name}
          </a>
        );
      })}
    </div>
  );
};