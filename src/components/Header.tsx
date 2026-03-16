import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart, useMember } from '@/integrations';
import { useVerificationStatus } from '@/hooks/useVerificationStatus';
import { usePaymentStatus } from '@/hooks/usePaymentStatus';
import Cart from '@/components/Cart';
import NotificationCenter from '@/components/NotificationCenter';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { itemCount, actions } = useCart();
  const { member, actions: memberActions } = useMember();
  const { verificationStatus } = useVerificationStatus(member?._id);
  const { hasPaymentMethod } = usePaymentStatus(member?._id);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/pets', label: 'Browse Pets' },
    { path: '/auctions', label: 'Live Auctions' },
    { path: '/contact', label: 'Contact' }
  ];

  // Show Add Pet link only if user is verified, has payment method, and is a seller
  const showAddPetLink = member && verificationStatus === 'approved' && hasPaymentMethod;

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-secondary/10">
        <div className="w-full max-w-[100rem] mx-auto px-8 lg:px-16 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="font-heading text-2xl lg:text-3xl text-secondary font-bold"
              >
                Zafira Nero
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2 bg-subtlebackground rounded-full px-6 py-3">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`font-paragraph font-medium px-6 py-2 rounded-full transition-all ${
                      isActive(link.path)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-secondary hover:bg-brandaccent/30'
                    }`}
                  >
                    {link.label}
                  </motion.button>
                </Link>
              ))}
              {member && (
                <Link to="/verify">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`font-paragraph font-medium px-6 py-2 rounded-full transition-all ${
                      isActive('/verify')
                        ? 'bg-primary text-primary-foreground'
                        : 'text-secondary hover:bg-brandaccent/30'
                    }`}
                  >
                    Verify
                  </motion.button>
                </Link>
              )}
              {showAddPetLink && (
                <Link to="/add-pet">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`font-paragraph font-medium px-6 py-2 rounded-full transition-all ${
                      isActive('/add-pet')
                        ? 'bg-primary text-primary-foreground'
                        : 'text-secondary hover:bg-brandaccent/30'
                    }`}
                  >
                    Add Pet
                  </motion.button>
                </Link>
              )}
            </nav>

            {/* Cart, Notifications & Mobile Menu Toggle */}
            <div className="flex items-center gap-4">
              <NotificationCenter />
              
              <button
                onClick={actions.toggleCart}
                className="relative p-2 hover:bg-subtlebackground rounded-full transition-colors"
              >
                <ShoppingCart className="w-6 h-6 text-secondary" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              {member ? (
                <Link to="/profile">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="p-2 hover:bg-subtlebackground rounded-full transition-colors"
                  >
                    <User className="w-6 h-6 text-secondary" />
                  </motion.button>
                </Link>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={memberActions.login}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-full font-paragraph font-semibold text-sm hover:brightness-110 transition-all"
                >
                  Sign In
                </motion.button>
              )}

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-subtlebackground rounded-full transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-secondary" />
                ) : (
                  <Menu className="w-6 h-6 text-secondary" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-4 overflow-hidden"
              >
                <div className="flex flex-col gap-2 bg-subtlebackground rounded-3xl p-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <button
                        className={`w-full font-paragraph font-medium px-6 py-3 rounded-full text-left transition-all ${
                          isActive(link.path)
                            ? 'bg-primary text-primary-foreground'
                            : 'text-secondary hover:bg-brandaccent/30'
                        }`}
                      >
                        {link.label}
                      </button>
                    </Link>
                  ))}
                  {member && (
                    <Link
                      to="/verify"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <button
                        className={`w-full font-paragraph font-medium px-6 py-3 rounded-full text-left transition-all ${
                          isActive('/verify')
                            ? 'bg-primary text-primary-foreground'
                            : 'text-secondary hover:bg-brandaccent/30'
                        }`}
                      >
                        Verify
                      </button>
                    </Link>
                  )}
                  {showAddPetLink && (
                    <Link
                      to="/add-pet"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <button
                        className={`w-full font-paragraph font-medium px-6 py-3 rounded-full text-left transition-all ${
                          isActive('/add-pet')
                            ? 'bg-primary text-primary-foreground'
                            : 'text-secondary hover:bg-brandaccent/30'
                        }`}
                      >
                        Add Pet
                      </button>
                    </Link>
                  )}
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>

      <Cart />
    </>
  );
}
