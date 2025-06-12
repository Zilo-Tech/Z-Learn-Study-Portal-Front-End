// Navigation Links Component
export const NavigationLinks = ({
  items = [
    { label: 'Home', href: '/' },
    { label: 'Courses', href: '/courses' },
    { label: 'Enrollments', href: '/enrollments' },
    { label: 'Study Sessions', href: '/study-sessions/demo' },
    { label: 'Achievements', href: '/achievements' },
    { label: 'Messages', href: '/messages' },
    { label: 'Admin Outline', href: '/admin/courses/1/outline' },
    { label: 'Analytics', href: '/admin/analytics' }
  ],
  className = ""
}) => (
  <div className={`flex items-center gap-4 lg:gap-9 ${className}`}>
    {items.map((item) => (
      <a
        key={item.label}
        className="text-[#0d141c] text-sm leading-normal hover:text-brand font-semibold"
        href={item.href}
      >
        {item.label}
      </a>
    ))}
  </div>
);