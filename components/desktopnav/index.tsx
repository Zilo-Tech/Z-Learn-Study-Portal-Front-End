import { AuthButtons } from "../auth-buttons";
import { NavigationLinks } from "../ui/navigation-links";

interface DesktopNavigationProps {
  items?: { label: string; href: string }[];
}

export const DesktopNavigation = ({ items }: DesktopNavigationProps) => (
  <div className="hidden md:flex flex-1 justify-end gap-8">
    <NavigationLinks items={items} />
    <AuthButtons variant="desktop" />
  </div>
);
