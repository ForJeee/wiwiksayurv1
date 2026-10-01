import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Button } from './ui/button';

export default function Navbar() {
  const { cart, setIsCartOpen, user, setUser } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-2xl text-primary tracking-tight">WiwikSayur.id</span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link to="/" className="text-gray-900 hover:text-primary inline-flex items-center px-1 pt-1 text-sm font-medium">Beranda</Link>
              <Link to="/tentang-kami" className="text-gray-500 hover:text-primary inline-flex items-center px-1 pt-1 text-sm font-medium">Tentang Kami</Link>
              <Link to="/kontak" className="text-gray-500 hover:text-primary inline-flex items-center px-1 pt-1 text-sm font-medium">Kontak</Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="h-5 w-5 text-gray-700" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </Button>
            {user ? (
              <Link to="/profile">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Profil</span>
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button>Masuk</Button>
              </Link>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden space-x-2">
            <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="h-5 w-5 text-gray-700" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-emerald-100">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" className="bg-emerald-50 border-primary text-primary block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Beranda</Link>
            <Link to="/tentang-kami" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Tentang Kami</Link>
            <Link to="/kontak" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Kontak</Link>
            {user ? (
              <Link to="/profile" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Profil</Link>
            ) : (
              <Link to="/auth" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Masuk / Daftar</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
