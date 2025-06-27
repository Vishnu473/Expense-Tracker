import { Navigate, Outlet } from "react-router-dom";
import Header from "./Header";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const Layout = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) return <Navigate to="/login" />;
  return (
    <>
      <Header />
      <main className="pt-12 bg-white dark:bg-gray-800" role="main">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
