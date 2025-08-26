import React, { useState } from 'react';
import { useUser, UserButton, SignIn } from '@stackframe/stack';

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = useUser();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  if (!user) {
    return (
      <header className="fixed top-0 left-0 right-0 bg-gray-900/50 backdrop-blur-lg border-b border-white/10 z-50">
        <div className="flex justify-between items-center px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24 py-4">
          <div className="flex items-center gap-3">
            <img 
              src="/logo_transparent.png" 
              alt="My Medal Logo" 
              className="h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 w-auto object-contain" 
            />
          </div>
          
          <div className="flex items-center">
            <div className="bg-transparent border border-white/20 rounded-lg text-white px-4 py-2">
              <SignIn />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900/50 backdrop-blur-lg border-b border-white/10 z-50">
      <div className="flex justify-between items-center px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24 py-4">
        <div className="flex items-center gap-3">
          <img 
            src="/logo_transparent.png" 
            alt="My Medal Logo" 
            className="h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 w-auto object-contain" 
          />
          <span className="text-white text-sm">Welcome, {user.displayName || user.primaryEmail}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <UserButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
