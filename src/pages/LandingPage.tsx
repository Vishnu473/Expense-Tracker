import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import {
  FiBarChart2,
  FiTrendingUp,
  FiTarget,
  FiLock,
  FiMenu,
  FiX,
} from "react-icons/fi";

const LandingPage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white scroll-smooth">
      {/* Navbar */}
      <header className="absolute top-0 z-50 w-full bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex items-center justify-between">
        {/* App Name */}
        <h1 className="text-xl md:text-2xl font-bold text-blue-600 dark:text-cyan-400">
          ExpenseTracker
        </h1>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-2xl text-blue-600 dark:text-cyan-400"
          >
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-4 text-sm md:text-base">
          <a href="#hero" className="font-semibold hover:underline text-gray-500 hover:text-blue-500 dark:hover:text-gray-300">Home</a>
          <a href="#about" className="font-semibold hover:underline text-gray-500 hover:text-blue-500 dark:hover:text-gray-300">About</a>
          <a href="#features" className="font-semibold hover:underline text-gray-500 hover:text-blue-500 dark:hover:text-gray-300">Features</a>
          <a href="#demo" className="font-semibold hover:underline text-gray-500 hover:text-blue-500 dark:hover:text-gray-300">Demo</a>

          {user ? (
            <Link
              to="/dashboard"
              className="text-blue-600 dark:text-cyan-400 hover:underline"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md"
              >
                Register
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute border-t border-blue-500 dark:border-cyan-500 top-full left-0 right-0 z-40 md:hidden bg-white dark:bg-gray-800 space-y-4 px-6 py-4 shadow-md">
            <a href="#hero" className="block hover:underline text-gray-500 hover:text-blue-500 dark:hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
            <a href="#about" className="block hover:underline text-gray-500 hover:text-blue-500 dark:hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>About</a>
            <a href="#features" className="block hover:underline text-gray-500 hover:text-blue-500 dark:hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
            <a href="#demo" className="block hover:underline text-gray-500 hover:text-blue-500 dark:hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Demo</a>

            {user ? (
              <Link
                to="/dashboard"
                className="block text-blue-600 dark:text-cyan-400 hover:underline"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <div className="inline-flex flex-col gap-2">
                <Link
                  to="/login"
                  className="inline-block dark:text-gray-600 dark:hover:text-gray-300 hover:text-blue-700 text-blue-500 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-block dark:text-gray-600 dark:hover:text-gray-300 hover:text-blue-700 text-blue-500 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className="flex flex-col items-center text-center justify-center px-6 py-20">
        <h2 className="text-3xl mt-5 md:mt-20 sm:text-4xl md:text-5xl font-extrabold mb-4 max-w-2xl">
          Take Control of Your Finances
        </h2>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mb-6">
          Track income, expenses, savings, and visualize your progress—all in one powerful, privacy-first dashboard.
        </p>
        {!user && (
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
              Get Started
            </Link>
            <Link to="/login" className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium">
              Login
            </Link>
          </div>
        )}
      </section>

      {/* About Section */}
      <section id="about" className="px-6 py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">About Us</h3>
          <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg">
            ExpenseTracker was built to help individuals and families manage their money efficiently. Our goal is to give you the insight and control you need to reach your financial goals with ease.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-16">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-10">Features</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 rounded-lg shadow bg-white dark:bg-gray-700 text-left">
              <FiBarChart2 className="text-2xl text-blue-500 dark:text-cyan-400 mb-2" />
              <h4 className="text-lg font-semibold mb-1">Visual Reports</h4>
              <p className="text-gray-600 dark:text-gray-300">Line, bar, and pie charts give insights into your financial health.</p>
            </div>
            <div className="p-6 rounded-lg shadow bg-white dark:bg-gray-700 text-left">
              <FiTrendingUp className="text-2xl text-blue-500 dark:text-cyan-400 mb-2" />
              <h4 className="text-lg font-semibold mb-1">Smart Transactions</h4>
              <p className="text-gray-600 dark:text-gray-300">Track, filter, and sort your transactions with ease.</p>
            </div>
            <div className="p-6 rounded-lg shadow bg-white dark:bg-gray-700 text-left">
              <FiTarget className="text-2xl text-blue-500 dark:text-cyan-400 mb-2" />
              <h4 className="text-lg font-semibold mb-1">Goal-Oriented Savings</h4>
              <p className="text-gray-600 dark:text-gray-300">Set goals, track progress, and stay motivated.</p>
            </div>
            <div className="p-6 rounded-lg shadow bg-white dark:bg-gray-700 text-left">
              <FiLock className="text-2xl text-blue-500 dark:text-cyan-400 mb-2" />
              <h4 className="text-lg font-semibold mb-1">Secure and Private</h4>
              <p className="text-gray-600 dark:text-gray-300">Your data is encrypted and never shared. You stay in control.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section id="demo" className="px-6 py-16 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-6">Watch ExpenseTracker in Action</h3>
          <div className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300">
            Demo video placeholder
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 text-center py-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          © {new Date().getFullYear()} ExpenseTracker. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
