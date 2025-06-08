// Navigation Links Component
export const NavigationLinks = ({ items = ['Home', 'Courses', 'Instructors', 'Pricing'], className = "" }) => (
    <div className={`flex items-center gap-4 lg:gap-9 ${className}`}>
      {items.map((item) => (
        <a
          key={item}
          className="text-[#0d141c] text-sm  leading-normal hover:text-brand font-semibold"
          href="#"
        >
          {item}
        </a>
      ))}
    </div>
  );