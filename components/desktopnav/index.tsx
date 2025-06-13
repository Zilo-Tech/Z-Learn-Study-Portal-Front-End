import { AuthButtons } from "../auth-buttons";
import { NavigationLinks } from "../ui/navigation-links";
import { UserMenu } from "../user-menu";
import { NavigationItem } from '@/types/navigation';

interface DesktopNavigationProps {
  items: NavigationItem[];
}

export const DesktopNavigation = ({ items }: DesktopNavigationProps) => (
    <div className="hidden md:flex flex-1 justify-end gap-8">
      <NavigationLinks items={items} />
      <UserMenu />
      <AuthButtons variant="desktop" />
    </div>
  );
  