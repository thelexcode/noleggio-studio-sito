import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHome, setIsHome] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setIsHome(location.pathname === '/');
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  // Text color logic: White on top of Home hero, Dark otherwise or when scrolled
  const textColor = (isHome && !scrolled) ? 'text-white' : 'text-accent';
  const logoColor = (isHome && !scrolled) ? 'text-white' : 'text-[#454545]';
  const bgColor = scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent';

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Chi Siamo', path: '/chi-siamo' },
    { name: 'Servizi', path: '/servizi' },
    { name: 'Galleria', path: '/galleria' },
    { name: 'Contatti', path: '/contatti' },
  ];

  return (
    <div className={`fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-4 flex justify-between items-center transition-all duration-300 ${bgColor}`}>
      <Link to="/" className="flex items-center">
        <Logo className={`h-12 md:h-16 w-auto ${logoColor}`} />
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:block">
        <ul className="flex gap-10">
          {links.map((link) => (
            <li key={link.path}>
              <Link 
                to={link.path} 
                className={`relative font-medium text-sm uppercase tracking-wider hover:opacity-100 transition-opacity opacity-80 ${textColor} ${location.pathname === link.path ? 'opacity-100 font-bold' : ''}`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div 
                    layoutId="underline"
                    className={`absolute -bottom-1 left-0 right-0 h-0.5 ${(isHome && !scrolled) ? 'bg-white' : 'bg-primary'}`}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Menu Button */}
      <button className={`md:hidden ${textColor}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed top-20 left-0 w-full bg-white shadow-xl p-8 flex flex-col items-center gap-6 md:hidden z-40 max-h-[80vh] overflow-y-auto rounded-b-xl border-t border-gray-100"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {links.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setIsOpen(false)}
                className={`text-lg font-serif ${location.pathname === link.path ? 'text-primary font-bold' : 'text-slate-600'}`}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
