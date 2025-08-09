import { useState, useRef, useEffect, type ReactNode } from 'react';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  menuClassName?: string;
}

export function Dropdown({ trigger, children, menuClassName = '' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="focus:outline-none">
        {trigger}
      </button>
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 ${menuClassName}`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps {
  onClick: () => void;
  children: ReactNode;
}

export function DropdownItem({ onClick, children }: DropdownItemProps) {
  return (
    <a
      // href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      role="menuitem"
    >
      {children}
    </a>
  );
}
