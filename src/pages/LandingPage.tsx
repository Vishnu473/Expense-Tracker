import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const LandingPage = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center dark:bg-gray-900 dark:text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to Expense Tracker</h1>
      {user ? (
        <Link to="/dashboard" className="text-blue-500 underline">
          Go to Dashboard
        </Link>
      ) : (
        <div className="space-x-4">
          <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded">
            Login
          </Link>
          <Link to="/register" className="bg-gray-600 text-white px-4 py-2 rounded">
            Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
