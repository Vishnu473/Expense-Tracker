import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-center px-6">
      <h1 className="text-8xl font-extrabold text-blue-600 dark:text-blue-400 mb-4" aria-label="404 Error - Page not found">404</h1>
      <p className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-100">
        Oops! Page not found.
      </p>
      <p className="text-gray-600 dark:text-gray-400 mt-2 mb-6 max-w-lg">
        The page you're looking for doesn’t exist or may have been moved. Let’s get you back on track.
      </p>
      <Link
        to="/dashboard"
        className="inline-flex items-center px-6 py-3 text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-xl text-lg font-medium shadow-md transition duration-300"
      >
        <FiArrowLeft className="mr-2 w-5 h-5" />
        Go back to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;