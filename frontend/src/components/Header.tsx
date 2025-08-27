import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

const Header: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleSignOut = () => {
    signOut();
    closeDropdown();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-gray-900/50 backdrop-blur-lg border-b border-white/10 z-50">
        <div className="flex justify-between items-center px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24 py-4">
          <div className="flex items-center gap-3">
            <img 
              src="/logo_transparent.png" 
              alt="My Medal Logo" 
              className="h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 w-auto object-contain" 
            />
          </div>
          
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <span className="text-white text-sm">Welcome, {user.displayName}</span>
                <div className="relative">
                <button 
                  className="bg-transparent border border-white/20 rounded-lg text-gray-400 
                             p-2.5 sm:p-3 cursor-pointer transition-all duration-300 ease-in-out 
                             hover:bg-white/10 hover:border-white/40 hover:text-gray-300
                             w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12
                             flex items-center justify-center"
                  onClick={toggleDropdown}
                  onBlur={() => setTimeout(closeDropdown, 150)}
                >
                  <i className="fas fa-user text-base sm:text-lg"></i>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-black/95 backdrop-blur-xl 
                                  border border-white/10 rounded-xl py-2 min-w-48 
                                  shadow-2xl z-50">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-white text-sm font-medium">{user?.displayName}</p>
                      <p className="text-gray-400 text-xs">{user?.email}</p>
                    </div>
                    <button 
                      onClick={handleSignOut}
                      className="flex items-center gap-3 w-full px-4 py-3 
                                bg-transparent border-none text-white/90 text-sm
                                cursor-pointer transition-all duration-200 ease-in-out 
                                hover:bg-white/10 hover:text-white text-left"
                    >
                      <i className="fas fa-sign-out-alt text-sm w-4 text-center"></i>
                      Sign Out
                    </button>
                  </div>
                )}
                </div>
              </>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-transparent border border-white/20 rounded-lg text-white px-4 py-2
                           hover:bg-white/10 hover:border-white/40 transition-all duration-300"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Header;
