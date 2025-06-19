import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiLogOut, FiMenu, FiMoon, FiSun, FiX } from "react-icons/fi";
import clsx from "clsx";
import { useTheme } from "../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from '../redux/store';
import { logout } from "../redux/slices/authSlice";
import { toast } from "react-toastify";
import { clearBankAccounts } from "../redux/slices/bankSlice";

const navLinks = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Transactions", path: "/transactions" },
  { name: "Savings", path: "/savings" },
  { name: "Reports", path: "/reports" },
  { name: "Settings", path: "/settings" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setOpen(!open);
  const {theme,toggleTheme} = useTheme();

  const user = useSelector((state:RootState)=> state.auth.user);
  const dispatch = useDispatch();

  return (
    <header className="fixed top-0 left-0 w-full backdrop-blur-md backdrop-filter bg-transparent border-b border-gray-400 text-black dark:text-white shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="text-2xl font-bold text-blue-600 dark:text-cyan-400">
          <Link to="/">💰 Expense Tracker</Link>
        </div>

        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={clsx(
                "hover:text-blue-600 dark:hover:text-cyan-400 transition-colors",
                location.pathname === link.path && "text-blue-600 dark:text-cyan-400 font-semibold"
              )}
            >
              {link.name}
            </Link>
          ))}
          <button onClick={toggleTheme} className="text-xl text-slate-900 dark:text-white">
            {theme === "light" ? <FiMoon /> : <FiSun />}
          </button>
          {
            user ?
            <button onClick={() => {
              dispatch(clearBankAccounts());
              dispatch(logout());
              toast.info("Logged out!");
            }}
            className="flex justify-center items-center gap-1 text-red-500 hover:underline">
              <FiLogOut/>Logout</button> : null
          }
        </nav>

        <button onClick={toggleMenu} className="md:hidden text-2xl">
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden bg-white border-t-cyan-500 border-t dark:bg-gray-800 shadow-md px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setOpen(false)}
              className={clsx(
                "block text-gray-700 dark:text-gray-300",
                location.pathname === link.path && "text-blue-600 dark:text-cyan-600 font-semibold"
              )}
            >
              {link.name}
            </Link>
          ))}
          <button onClick={toggleTheme} className="text-xl text-slate-900 dark:text-white">
            {theme === "light" ? <FiMoon /> : <FiSun />}
          </button>
          {
            user ?
            <button onClick={() => {
              dispatch(logout());
              toast.info("Logged out!");
            }}
            className="flex justify-center items-center gap-1 text-red-500 hover:underline">
              <FiLogOut/>Logout</button> : null
          }
        </nav>
      )}
    </header>
  );
};

export default Header;