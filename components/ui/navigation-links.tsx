import { NavigationItem } from '@/types/navigation';

interface NavigationLinksProps {
  items: NavigationItem[];
  className?: string;
}

// Navigation Links Component
export const NavigationLinks = ({ items = [], className = "" }: NavigationLinksProps) => (
    <div className={`flex items-center gap-4 lg:gap-9 ${className}`}>
      {items.map((item) => (
        <a
          key={item.name}
          className="text-[#0d141c] text-sm leading-normal hover:text-brand font-semibold"
          href={item.href}
        >
          {item.name}
        </a>
      ))}
    </div>
  );